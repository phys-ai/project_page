// Set the dimensions of the canvas / graph
var margin_mini = {top: 30, right: 20, bottom: 70, left: 80},
    width4 = 350 - margin_mini.left - margin_mini.right,
    height4 = 250 - margin_mini.top - margin_mini.bottom;

// Parse the date / time
//var parseDate = d3.time.format("%b %Y").parse;

// Set the ranges
//var x = d3.time.scale().range([0, width4]);
var x4 = d3.scale.linear().range([0, width4]);
var y4 = d3.scale.linear().range([height4, 0]);

// Define the axes
var xAxis4 = d3.svg.axis().scale(x4)
    .orient("bottom").ticks(5);

var yAxis4 = d3.svg.axis().scale(y4)
    .orient("left").ticks(5);

// Define the line
var priceline4 = d3.svg.line()	
    .x(function(d) { return x4(d.date); })
    .y(function(d) { return y4(d.price); });
    
// Adds the svg canvas
var svg4 = d3.select("#mini_chartContainer4")
    .append("svg")
        .attr("width", width4 + margin_mini.left + margin_mini.right)
        .attr("height", height4 + margin_mini.top + margin_mini.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin_mini.left + "," + margin_mini.top + ")");

// Get the data
d3.csv("data/frequency_data_010_js.csv", function(error, data) {
    data.forEach(function(d) {
		//d.date = parseDate(d.date);
		d.date = d.timestep;
		d.price = d.acc;
    });

    // Scale the range of the data
    //x4.domain(d3.extent(data, function(d) { return d.date; }));
    x4.domain([0, 250]);
    y4.domain([0, d3.max(data, function(d) { return d.price; })]);

    // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function(d) {return d.label;})
        .entries(data);

    //var color = d3.scale.category10();   // set the colour scale
    var colors = {"000": '#56C1FF', "001": '#56C1FF', "100": '#56C1FF', "010": '#56C1FF', "011": '#FF95CA', "110": '#FF95CA', "101": '#FF95CA', "111": '#ED220D'} 
    var linestyles = {"000": "0, 0", "001": "3, 3", "100": "9, 5, 1, 5", "010": "1, 1", "011": "0, 0", "110": "0, 0", "101": "9, 5, 1, 5", "111": "0, 0"} 

    // Loop through each symbol / key
    dataNest.forEach(function(d,i) { 

        svg4.append("path")
            .attr("class", "line")
            .style("stroke", function() { // Add the colours dynamically
                   //return d.color = color(d.key); })
                   return d.color = colors[d.key]; })
            .style("stroke-width", "3")
            .style("stroke-dasharray", (linestyles[d.key]))
            .attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign ID
            .attr("d", priceline4(d.values));
    });

    // Add the X Axis
    svg4.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height4 + ")")
        .call(xAxis4);

    // Add the Y Axis
    svg4.append("g")
        .attr("class", "y axis")
        .call(yAxis4);

    // X label
    svg4.append('text')
    .attr('x', width4/2)
    .attr('y', height4 + 45)
    .attr('text-anchor', 'middle')
    //.style('font-family', 'Helvetica')
    //.style('font-size', 12)
    .text('Optimization step');
    
    // Y label
    svg4.append('text')
    .attr('x', 80)
    .attr('y', -110)
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(60,' + height4 + ')rotate(-90)')
    //.style('font-family', 'Helvetica')
    //.style('font-size', 20)
    .text('Accuracy');

    // Legend
    var legend = svg4.selectAll('.legend')
        .data(dataNest)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) { 
            return 'translate(0,' + i * 15 + ')'; 
        });
    
    legend.append('line') // append a line to each legend group (g)
        .attr('x1', width4 - 60)
        .attr('x2', width4 - 30)
        .attr('y1', height4 - 115)
        .attr('y2', height4 - 115)
        .style('stroke', function(d) { return colors[d.key]; }) // line color
        .style("stroke-width", "3")
        .style("stroke-dasharray", (d) => linestyles[d.key]);
    
    legend.append('text')
        .attr('x', width4 - 70)
        .attr('y', height4 - 115)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text(function(d) { return d.key; });
       
});
