// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 70, left: 80},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Set the ranges
var x1 = d3.scale.linear().range([0, width]);
var y1 = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis1 = d3.svg.axis().scale(x1)
    .orient("bottom").ticks(5);

var yAxis1 = d3.svg.axis().scale(y1)
    .orient("left").ticks(5);

// Define the line
var priceline1 = d3.svg.line()  
    .x(function(d) { return x1(d.date); })
    .y(function(d) { return y1(d.price); });

// Adds the svg canvas
var svg1 = d3.select("#chartContainer1")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("data/learning_dynamics_js.csv", function(error, data) {
    data.forEach(function(d) {
		d.date = +d.timestep;
		d.price = +d.acc;
    });

    // Scale the range of the data
    var dateExtent = d3.extent(data, function(d) { return d.date; });
    x1.domain(dateExtent);
    y1.domain([0, d3.max(data, function(d) { return d.price; })]);


    // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function(d) {return d.label;})
        .entries(data);

    //var color = d3.scale.category10();   // set the colour scale
    var colors = {"000": '#56C1FF', "001": '#56C1FF', "100": '#56C1FF', "010": '#56C1FF', "011": '#FF95CA', "110": '#FF95CA', "101": '#FF95CA', "111": '#ED220D'} 
    var linestyles = {"000": "0, 0", "001": "3, 3", "100": "9, 5, 1, 5", "010": "1, 1", "011": "0, 0", "110": "0, 0", "101": "9, 5, 1, 5", "111": "0, 0"} 


    //legendSpace = width/dataNest.length; // spacing for the legend

    // Loop through each symbol / key
    dataNest.forEach(function(d,i) { 

    svg1.append("path")
            .attr("class", "line")
            .style("stroke", function() { // Add the colours dynamically
                   //return d.color = color(d.key); })
                   return d.color = colors[d.key]; })
            .style("stroke-width", "3")
            .style("stroke-dasharray", (linestyles[d.key]))
            .attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign ID
            .attr("d", priceline1(d.values));

    });

    // Add the X Axis
    svg1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis1);

    // Add the Y Axis
    svg1.append("g")
        .attr("class", "y axis")
        .call(yAxis1);

    // X label
    svg1.append('text')
    .attr('x', width/2)
    .attr('y', height + 45)
    .attr('text-anchor', 'middle')
    //.style('font-family', 'Helvetica')
    //.style('font-size', 12)
    .text('Optimization step');
    
    // Y label
    svg1.append('text')
    .attr('x', 100)
    .attr('y', -110)
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(60,' + height + ')rotate(-90)')
    //.style('font-family', 'Helvetica')
    .style('font-size', 20)
    .text('Accuracy');


    // Legend
    var legend = svg1.selectAll('.legend')
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

