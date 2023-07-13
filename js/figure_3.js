// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 70, left: 80},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Parse the date / time
//var parseDate = d3.time.format("%b %Y").parse;

// Set the ranges
//var x = d3.time.scale().range([0, width]);
var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var priceline = d3.svg.line()	
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); });
    
// Adds the svg canvas
var svg3 = d3.select("#chartContainer3")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("data/learning_dynamics_js.csv", function(error, data) {
    data.forEach(function(d) {
		//d.date = parseDate(d.date);
		d.date = d.timestep;
		d.price = d.acc;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.price; })]);
    //console.log("d.key:", d.key)

    // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function(d) {return d.label;})
        .entries(data);

    //var color = d3.scale.category10();   // set the colour scale
    var colors = {"000": 'red', "001": 'blue', "100": 'red', "010": 'red', "011": 'blue', "110": 'red', "101": 'blue', "111": 'blue'} 
    var linestyles = {"000": "0, 0", "001": "0, 0", "100": "0, 0", "010": "1, 1", "011": "2, 2", "110": "1, 1", "101": "9, 5, 1, 5", "111": "3, 3"}

    legendSpace = width/dataNest.length; // spacing for the legend

    // Loop through each symbol / key
    dataNest.forEach(function(d,i) { 

        svg3.append("path")
            .attr("class", "line")
            .style("stroke", function() { // Add the colours dynamically
                   //return d.color = color(d.key); })
                   return d.color = colors[d.key]; })
            .style("stroke-width", "3")
            .style("stroke-dasharray", (linestyles[d.key]))
            .attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign ID
            .attr("d", priceline(d.values));
    });

    // Add the X Axis
    svg3.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg3.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // X label
    svg3.append('text')
    .attr('x', width/2)
    .attr('y', height + 45)
    .attr('text-anchor', 'middle')
    //.style('font-family', 'Helvetica')
    //.style('font-size', 12)
    .text('Optimization step');
    
    // Y label
    svg3.append('text')
    .attr('x', 100)
    .attr('y', -110)
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(60,' + height + ')rotate(-90)')
    //.style('font-family', 'Helvetica')
    .style('font-size', 20)
    .text('Accuracy');


    // Legend
    var legend = svg3.selectAll('.legend')
        .data(dataNest)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) { 
            return 'translate(0,' + i * 20 + ')'; 
        });
    
    legend.append('line') // append a line to each legend group (g)
        .attr('x1', width - 60)
        .attr('x2', width - 30)
        .attr('y1', height - 160)
        .attr('y2', height - 160)
        .style('stroke', function(d) { return colors[d.key]; }) // line color
        .style("stroke-width", "3")
        .style("stroke-dasharray", (d) => linestyles[d.key]);
    
    legend.append('text')
        .attr('x', width - 70)
        .attr('y', height - 160)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text(function(d) { return d.key; });
       
});
