// Set the dimensions of the canvas / graph
var margin_mini = {top: 30, right: 20, bottom: 70, left: 80},
    width_mini = 350 - margin_mini.left - margin_mini.right,
    height_mini = 250 - margin_mini.top - margin_mini.bottom;

// Parse the date / time
//var parseDate = d3.time.format("%b %Y").parse;

// Set the ranges
//var x = d3.time.scale().range([0, width_mini]);
var x5 = d3.scale.linear().range([0, width_mini]);
var y5 = d3.scale.linear().range([height_mini, 0]);

// Define the axes
var xAxis5 = d3.svg.axis().scale(x5)
    .orient("bottom").ticks(5);

var yAxis5 = d3.svg.axis().scale(y5)
    .orient("left").ticks(5);

// Define the line
var priceline5 = d3.svg.line()	
    .x(function(d) { return x5(d.date); })
    .y(function(d) { return y5(d.price); });
    
// Adds the svg canvas
var svg5 = d3.select("#mini_chartContainer5")
    .append("svg")
        .attr("width", width_mini + margin_mini.left + margin_mini.right)
        .attr("height", height_mini + margin_mini.top + margin_mini.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin_mini.left + "," + margin_mini.top + ")");

// Get the data
d3.csv("data/frequency_data_100_js.csv", function(error, data) {
    data.forEach(function(d) {
		//d.date = parseDate(d.date);
		d.date = d.timestep;
		d.price = d.acc;
    });

    // Scale the range of the data
    //x.domain(d3.extent(data, function(d) { return d.date; }));
    x5.domain([0, 270]);
    y5.domain([0, d3.max(data, function(d) { return d.price; })]);
    //console.log("d.key:", d.key)

    // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function(d) {return d.label;})
        .entries(data);

    //var color = d3.scale.category10();   // set the colour scale
    var colors = {"000": '#56C1FF', "001": '#56C1FF', "100": '#56C1FF', "010": '#56C1FF', "011": '#FF95CA', "110": '#FF95CA', "101": '#FF95CA', "111": '#ED220D'} 
    var linestyles = {"000": "0, 0", "001": "3, 3", "100": "9, 5, 1, 5", "010": "1, 1", "011": "0, 0", "110": "0, 0", "101": "9, 5, 1, 5", "111": "0, 0"} 

    // Loop through each symbol / key
    dataNest.forEach(function(d,i) { 

        svg5.append("path")
            .attr("class", "line")
            .style("stroke", function() { // Add the colours dynamically
                   //return d.color = color(d.key); })
                   return d.color = colors[d.key]; })
            .style("stroke-width", "3")
            .style("stroke-dasharray", (linestyles[d.key]))
            .attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign ID
            .attr("d", priceline5(d.values));
    });

    // Add the X Axis
    svg5.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height_mini + ")")
        .call(xAxis5);

    // Add the Y Axis
    svg5.append("g")
        .attr("class", "y axis")
        .call(yAxis5);

    // X label
    svg5.append('text')
    .attr('x', width_mini/2)
    .attr('y', height_mini + 45)
    .attr('text-anchor', 'middle')
    //.style('font-family', 'Helvetica')
    //.style('font-size', 12)
    .text('Optimization step');
    
    // Y label
    svg5.append('text')
    .attr('x', 80)
    .attr('y', -110)
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(60,' + height_mini + ')rotate(-90)')
    //.style('font-family', 'Helvetica')
    //.style('font-size', 20)
    .text('Accuracy');

    // Legend
    var legend = svg5.selectAll('.legend')
        .data(dataNest)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) { 
            return 'translate(0,' + i * 15 + ')'; 
        });
    
    legend.append('line') // append a line to each legend group (g)
        .attr('x1', width_mini - 10)
        .attr('x2', width_mini)
        .attr('y1', height_mini - 115)
        .attr('y2', height_mini - 115)
        .style('stroke', function(d) { return colors[d.key]; }) // line color
        .style("stroke-width", "3")
        .style("stroke-dasharray", (d) => linestyles[d.key]);
    
    legend.append('text')
        .attr('x', width_mini - 20)
        .attr('y', height_mini - 115)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text(function(d) { return d.key; });
       
});
