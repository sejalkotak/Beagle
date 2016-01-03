(function(){
  var margin, width, chartWidth, height, x, y, xAxis, yAxis, svg, metaEl;

  function showInfo(d) {
      metaEl.innerHTML = '<div id="content">' +d.letter+'<br>' +
                         '<div class="mentionCount">'+ d.frequency +'</div>' +
                         '<span id="details">' +
                         '<p>' +
                         '<div class="data">Median count: '+ d.median+'</div>' +
                        '<div class="data">Language: '+ d.language+'</div>' +
                         '</p>' +
                         '<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">The human brain cell can hold 5 times as much information as the Encyclopedia Britannica.</p>&mdash; OMG Facts (@OMGFacts) <a href="https://twitter.com/OMGFacts/status/683660444213612544">January 3, 2016</a></blockquote> ';
  }

  function hideInfo(d){
      // metaEl.innerHTML = '';
  }

  function type(d) {
    d.frequency = +d.frequency;
    d.median = +d.median;
    return d;
  }

  function initVars() {
    margin = {top: 100, right: 15, bottom: 30, left: 40};
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

    metaEl = document.getElementById('meta');
  }

  function renderChart(){
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
      .on('mouseover', showInfo)
      .on('mouseout', hideInfo);

      container.append("rect")
      .attr("class", "median")
      .attr("width", x.rangeBand())
      .attr("height", 3)
      .attr("x", function(d) { return x(d.letter); })
      .attr("y", function(d) { return y(d.median);  });
    });
  }

  function init() {
    initVars();
    renderChart();
  }

  init();

}())
