(function(){
  var margin, width, chartWidth, height, x, y, xAxis, yAxis, svg;

  margin = {top: 200, right: 20, bottom: 30, left: 40};
  width = 960 - margin.left - margin.right;
  height = 500 - margin.top - margin.bottom;
  chartWidth = width + margin.left + margin.right;

  x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

  y = d3.scale.linear()
  .range([0, height]);

  xAxis = d3.svg.axis()
  .scale(x)
  .orient("top")
  .tickSize([0, 0]);

  yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

  svg = d3.select("#chart").append("svg")
  .attr("width", chartWidth)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.tsv("data/data.tsv", type, function(error, data) {
    x.domain(data.map(function(d) { return d.letter; }));
    y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

    svg.append("g")
    .attr("class", "x axis")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "start")
    .attr("dx", ".2em")
    .attr("dy", "0.5em")
    .attr("transform", "rotate(-90)" );

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

    var container = svg.selectAll(".bar")
    .data(data)
    .enter();

    container.append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.letter); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return 0; })
    .attr("height", function(d) { return y(d.frequency); })
    .on('mouseover', function(d) { console.log(d) })
    .on('mouseout', function(d) { console.log(d) });

    container.append("rect")
    .attr("class", "median")
    .attr("width", x.rangeBand())
    .attr("height", 3)
    .attr("x", function(d) { return x(d.letter); })
    .attr("y", function(d) { return y(d.median);  });


  });

  function type(d) {
    d.frequency = +d.frequency;
    d.median = +d.median;
    return d;
  }

}())
