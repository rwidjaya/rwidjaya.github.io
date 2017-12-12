//
//NEGATIVE BAR
//

var margin3 = {top: 60, right: 30, bottom: 70, left: 30},
    width3 = 550 +  margin3.right,
    height3 = 550 + margin3.top + margin3.bottom;

// // X scale
var x_3 = d3.scaleLinear().range([0, width3]);
var y_3 = d3.scaleBand().rangeRound([height3/1.25, 0]);

var xAxis = d3.axisBottom(x_3);
var yAxis = d3.axisLeft(y_3)
              .tickSize(6, 0);

var avgWage = {'2014': 77000, '2015': 79000, '2016': 80000}

var chart3 = d3.select("#svg-3")
  .attr("width", width3) 
  .attr("height", height3) 
  .append("g")
  .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")")
  .attr('id', 'gNegBar');

d3.csv('h1b_neg.csv', type2, function (error, data) {
  if (error) {throw error} else {
    data.value = +data.value;
    dataSort= data.sort(function(x, y) {
      return d3.descending(x.cgroup, y.cgroup);
    });
    curData = dataSort.filter(function(d){ return d.year === '2014'; });
  }; 


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
      .attr('transform', 'translate(0,' +( height3 - margin3.bottom*2) + ')')
      .call(xAxis)
      .attr('id', 'xAxis')
      .append('text')
        .attr("x", 145)
        .attr("y", -height3/1.5-105)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .text("Avg Wage: $" + format(avgWage['2016']))
        .attr('id', 'avg-Wage');

  var tickNegative = chart3.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + x_3(0) + ','+(-2)+')')
    .call(yAxis)
    .selectAll('.tick')
    .filter(function (d, i) {return curData[i].value < 0;})
    .attr('id', 'yAxis');
    

  tickNegative.select('line')
    .attr('x2', 6);

  tickNegative.select('text')
    .attr('x', 10)
    .style('text-anchor', 'start');

  //
  // LEGEND
  //
  var legRect = 18;
  var legSpac = 4;
  legVar = d3.set(curData.map( function(d) { return d.cgroup } ) ).values();

  var legVar1 = d3.scaleOrdinal()
    .domain(legVar)
    .range(["#F29F05", "#F25C05", "#88A61B", "#D92525"]);

  var legend = chart3.selectAll('.legend')
    .data(legVar1.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
      var tall = legRect + legSpac;
      var horz = width3 - 9 * tall;
      var vert = height3 - (i * tall) - 610;
      return 'translate(' + horz + ',' + vert + ')'
    });

  legend.append('rect')
    .attr('width', legRect)
    .attr('height', legRect)
    .style('fill', legVar1)
    .style('stroke', legVar1);

  legend.append('text')
    .attr('x', legRect + legSpac)
    .attr('y', legRect - legSpac)
    .text(function(d) { return d.toUpperCase(); });

  // TITLE & CAPTION 
  chart3.append("g")
    .attr("class", "caption")
    .append("text")
      .attr("x", 0)
      .attr("y", height3/1.5 + 120)
      .text("Source: USCIS, Annual H1-B Performance & NYT, How Outsourcing Companies Are Gaming the Visa System");

  chart3.append("g")
    .attr("class", "title")
    .append("text")
      .attr("x", 0)
      .attr("y", height3/2 - 375)
      .text("Outsourcing Companies Pays Lower Wage");

  window.updateBar = function(index3){
    var index3 = index3.toString();
    var avgWage = 

    curData = dataSort.filter(function(d){ return d.year === index3; });

    y_3.domain(curData.map(function (d) {return d.name;}));
    x_3.domain(d3.extent(curData, function (d) {return d.value;})).nice();

    bars = d3.select('#gNegBar').selectAll(".bar")
      .remove()
      .exit()
      .data(curData).enter()
      .append('rect')
      .attr('class', function(d) {return "bar bar--" + (d.cgroup);})
      .attr('x', function (d) {return x_3(Math.min(0, d.value));})
      .attr('y', function (d) {return y_3(d.name);})
      .transition().duration(2000)
      .attr('width', function (d) {return Math.abs(x_3(d.value) - x_3(0));})
      .attr('height', 20);

    }

});

function type2(d) {
  d.value = +d.value;
  return d;
}