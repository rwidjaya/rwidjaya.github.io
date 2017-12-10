//
//NEGATIVE BAR
//

var margin3 = {top: 20, right: 30, bottom: 50, left: 30},
    width3 = 550 + margin3.left + margin3.right,
    height3 = 550 + margin3.top + margin3.bottom;

// // X scale
var x_3 = d3.scaleLinear().range([0, width3]);
var y_3 = d3.scaleBand().rangeRound([height3/1.25, 0]);

var xAxis = d3.axisBottom(x_3);
var yAxis = d3.axisLeft(y_3)
              .tickSize(6, 0);

var chart3 = d3.select("#svg-3")
  .attr("width", width3) 
  .attr("height", height3) 
  .append("g")
  .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")")
  .attr('id', 'gNegBar');

d3.csv('h1b_neg.csv', type2, function (error, data) {
  if (error) {throw error} else {
    data.value = +data.value;
    console.log(data)
    dataSort= data.sort(function(x, y) {
      return d3.descending(x.cgroup, y.cgroup);
    });
    curData = dataSort.filter(function(d){ return d.year === '2016'; });
  }; 

  console.log(curData)

  x_3.domain(d3.extent(curData, function (d) {return d.value;})).nice();
  y_3.domain(curData.map(function (d) {return d.name;}));

  chart3.selectAll('.bar')
    .data(curData)
    .enter().append('rect')
    .attr('class', function(d) {return "bar bar--" + (d.cgroup);})
    .attr('x', function (d) {return x_3(Math.min(0, d.value));})
    .attr('y', function (d) {return y_3(d.name);})
    .attr('width', function (d) {return Math.abs(x_3(d.value) - x_3(0));})
    .attr('height', 20)
    .attr('id', 'bar-chart');


  chart3.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' +( height3 - margin3.bottom*2 - 31) + ')')
      .call(xAxis)
      .attr('id', 'xAxis');

  var tickNegative = chart3.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + x_3(0) + ','+(-2)+')')
    .call(yAxis)
    .selectAll('.tick')
    .attr('id', 'yAxis')
    .filter(function (d, i) {return curData[i].value < 0;});

  tickNegative.select('line')
    .attr('x2', 6);

  tickNegative.select('text')
    .attr('x', 9)
    .style('text-anchor', 'start');

  //
  // LEGEND
  //
  var legendRectSize = 18;
  var legendSpacing = 4;
  legendVar = d3.set(curData.map( function(d) { return d.cgroup } ) ).values();

  var legendVar1 = d3.scaleOrdinal()
    .domain(legendVar)
    .range(["#D92525", "#F25C05", "#F29F05", "#88A61B"]);

  var legend = chart3.selectAll('.legend')
    .data(legendVar1.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
      var tall = legendRectSize + legendSpacing;
      var offset =  tall * d.length / 2;
      var horz = width3 - 8*tall;
      var vert = height3 - (i * tall) - 350;
      return 'translate(' + horz + ',' + vert + ')'
    });

  legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', legendVar1)
    .style('stroke', legendVar1);

  legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d.toUpperCase(); });

  // d3.select("#sliderControl").on("input", function() {
  window.updateBar = function(index3){
    var index3 = index3.toString();

    curData = dataSort.filter(function(d){ return d.year === index3; });

    // y_3.domain(curData.map(function (d) {return d.name;}));
    x_3.domain(d3.extent(curData, function (d) {return d.value;})).nice();

    bars = d3.select('#gNegBar').selectAll(".bar")
      .remove()
      .exit()
      .data(curData).enter()
      .append('rect')
      .attr('class', function(d) {return "bar bar--" + (d.cgroup);})
      .attr('x', function (d) {return x_3(Math.min(0, d.value));})
      .attr('y', function (d) {return y_3(d.name);})
      .attr('width', function (d) {return Math.abs(x_3(d.value) - x_3(0));})
      .attr('height', 20)

    tickNegativeUpdate = bars.select('#yAxis')
      .attr('transform', 'translate(' + x_3(0) + ','+(-2)+')')
      .selectAll('.tick')
      .attr('id', 'yAxis')
      .filter(function (d, i) {return curData[i].value < 0;});
      
    tickNegativeUpdate.select('line')
      .attr('x2', 6);

    tickNegativeUpdate.select('text')
      .attr('x', 9)
      .style('text-anchor', 'start');


      console.log(curData);
    }

  // });

});

function type2(d) {
  d.value = +d.value;
  return d;
}