// Set the dimensions of the canvas / graph
var margin = {top: 50, right: 20, bottom: 70, left: 80},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Parse the date / time
//var parseDate = d3.time.format("%b %Y").parse;

// Set the ranges
//var x = d3.time.scale().range([0, width]);
var x2 = d3.scale.linear().range([0, width]);
var y2 = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis2 = d3.svg.axis().scale(x2)
    .orient("bottom").ticks(5);

var yAxis2 = d3.svg.axis().scale(y2)
    .orient("left").ticks(5);

// Define the line
var priceline2 = d3.svg.line()	
    .x(function(d) { return x2(d.date); })
    .y(function(d) { return y2(d.price); });
    
// Adds the svg canvas
var svg2 = d3.select("#chartContainer2")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("data/individual_learning_dynamics_js.csv", function(error, data) {
    data.forEach(function(d) {
		//d.date = parseDate(d.date);
		d.date = d.timestep;
		d.price = d.acc;
    });

    // Scale the range of the data
    x2.domain(d3.extent(data, function(d) { return d.date; }));
    y2.domain([0, d3.max(data, function(d) { return d.price; })]);
    //console.log("d.key:", d.key)

    // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function(d) {return d.label;})
        .entries(data);

    //var color = d3.scale.category10();   // set the colour scale
    var colors = {"Shape": 'Blue', "Color": 'Orange', "Size": 'Green', "Additive": '#FF95CA', "Multiplicative": '#ED220D'} 
    var linestyles = {"Shape": "3, 3", "Color": "0, 0", "Size": "9, 5, 1, 5", "Additive": "2, 2","Multiplicative": "0, 0"} 

    // Loop through each symbol / key
    dataNest.forEach(function(d,i) { 

        svg2.append("path")
            .attr("class", "line")
            .style("stroke", function() { // Add the colours dynamically
                   //return d.color = color(d.key); })
                   return d.color = colors[d.key]; })
            .style("stroke-width", "3")
            .style("stroke-dasharray", (linestyles[d.key]))
            .attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign ID
            .attr("d", priceline2(d.values));
    });

    buttonNest = [{key: 'Multiplicative', color: '#ED220D'}, {key: 'Additive', color: '#FF95CA'}]
    buttonNest.forEach(function(d,i) { 
        // Add the Legend
        svg2.append("text")
            .attr("x", 70+i*200)  // space legend
            //.attr("y", height + (margin.bottom/2)+ 5)
            .attr("y", -30)
            .style("fill", function() { // Add the colours dynamically
                return d.color = colors[d.key]; })
            .on("click", function(){
                //var active = d.active ? false : true
                //newOpacity = active ? 0 : 1; 
                //d3.select("#tag"+d.key.replace(/\s+/g, ''))
                //    .transition().duration(100) 
                //    .style("opacity", newOpacity); 
                //d.active = active;
                var active = d.active ? false : true;
                var newOpacity = active ? 0 : 1; 
                d3.select("#tag" + d.key.replace(/\s+/g, ''))
                    .transition().duration(100) 
                    .style("opacity", newOpacity); 
                d.active = active;
            })  
            .text(d.key); 
    });

    // Add the X Axis
    svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis2);

    // Add the Y Axis
    svg2.append("g")
        .attr("class", "y axis")
        .call(yAxis2);

    // X label
    svg2.append('text')
    .attr('x', width/2)
    .attr('y', height + 45)
    .attr('text-anchor', 'middle')
    //.style('font-family', 'Helvetica')
    //.style('font-size', 12)
    .text('Optimization step');
    
    // Y label
    svg2.append('text')
    .attr('x', 100)
    .attr('y', -110)
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(60,' + height + ')rotate(-90)')
    //.style('font-family', 'Helvetica')
    .style('font-size', 20)
    .text('Accuracy');


    // Legend 
    var legendNest = [{key: 'Shape', color: 'Blue'}, {key: 'Color', color: 'Orange'}, {key: 'Size', color: 'Green'}]
    var legend = svg2.selectAll('.legend')
        .data(legendNest)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) { 
            return 'translate(0,' + i * 25 + ')'; 
        });
    
    legend.append('line') // append a line to each legend group (g)
        .attr('x1', width - 60)
        .attr('x2', width - 30)
        .attr('y1', height - 70)
        .attr('y2', height - 70)
        .style('stroke', function(d) { return colors[d.key]; }) // line color
        .style("stroke-width", "3")
        .style("stroke-dasharray", (d) => linestyles[d.key]);
    
    legend.append('text')
        .attr('x', width - 70)
        .attr('y', height - 70)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text(function(d) { return d.key; });
       
});
