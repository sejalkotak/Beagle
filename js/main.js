(function(){
  var counter = 0, bars, stopped, currentEl, prevEl,
  margin, width, chartWidth, height, x, y, xAxis, yAxis, svg, metaEl, timer, dataLength, dataItems, rects;

  $.fn.triggerSVGEvent = function(eventName, options) {
    var event = document.createEvent('SVGEvents');
    event.initEvent(eventName,true,true);
    this[0].dispatchEvent(event, options);
    return $(this);
  };

  function showInfo(d, index, j, skip) {
    stopped = false;
    metaEl.innerHTML = '<div id="stats">' +
    '<div id="details">' +
    '<img class="heart" src="images/heart.svg" alt="Kiwi standing on oval">' +
    '<div class="love">' +
    (d.love || '') +
    '</div>' +
    '<div class="description">' +
    (d.description || '') +
    '</div>' +
    '<div class="pByC"> Protein - ' +
    (d.proteinByCal || '') +
    ' gm/100cal</div>' +
    '</div>' +
    '<div id="name">' +d.name+'</div>' +
    '<div id="mainCount">'+ d.protein +'gm</div>' +
    '</div>' +
    '<p>' +
    '</p>';
    $(this).css('fill', '#8FB557');

    if(!skip){
      hideInfo.call(currentEl, currentEl.__data__);
      prevEl = currentEl;
      stopped = true;
      clearTimeout(timer);
    }
  }

  function hideInfo(d){
    $(this).css('fill', '#B3D480');
    if(stopped) {
      stopped = false;
      initTimer();
    }
  }

  function initVars() {
    margin = {top: 100, right: 50, bottom: 30, left: 40};
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
    jQuery.get('data/data.json').done(function (data) {
      dataItems = data;
      dataLength = data.length;
      x.domain(data.map(function(d) { return d.name; }));
      y.domain([0, d3.max(data, function(d) { return d.protein; })]);

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

      rects = container.append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.name); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return 0; })
      .attr("height", function(d) { return y(d.protein); })
      .on('mouseover', showInfo)
      .on('mouseout', hideInfo);

      container.append("rect")
      .attr("class", "median")
      .attr("width", x.rangeBand())
      .attr("height", 3)
      .attr("x", function(d) { return x(d.name); })
      .attr("y", function(d) { return y(d.proteinByCal);  });

      initTimer();
    });
  }

  function initTimer(){
    var index;
    bars = rects[0];
    timer = setInterval(function () {
        index = counter++ % dataLength
        prevEl = currentEl || bars[0];
        currentEl = bars[index];
        hideInfo.call(prevEl, prevEl.__data__);
        showInfo.call(currentEl, currentEl.__data__, index, 0, true);
    }, 3000);
  }

  function init() {
    initVars();
    renderChart();

  }

  init();

}())
