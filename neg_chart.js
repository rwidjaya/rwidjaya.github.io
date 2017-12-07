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
  .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

d3.csv('h1b_neg.csv', type2, function (error, data) {
  if (error) throw error;

  console.log(data)

  x_3.domain(d3.extent(data, function (d) {return d.value;})).nice();
  y_3.domain(data.map(function (d) {return d.name;}));

  chart3.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('class', function(d) {
      if (d.cgroup == 'us-firm') {
        return "bar bar--us-firm";
      }
      else if (d.cgroup == 'us-tech') {
        return "bar bar--us-tech";
      }
      else if (d.cgroup == 'us-outsource') {
        return "bar bar--us-outsource";
      }
      else {
        return "bar bar--foreign-outsource";
      }
    })
    .attr('x', function (d) {return x_3(Math.min(0, d.value));})
    .attr('y', function (d) {return y_3(d.name);})
    .attr('width', function (d) {return Math.abs(x_3(d.value) - x_3(0));})
    .attr('height', 20);


  chart3.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' +( height3 - margin3.bottom*2 - 31) + ')')
      .call(xAxis);

  var tickNegative = chart3.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + x_3(0) + ','+(-2)+')')
    .call(yAxis)
    .selectAll('.tick')
    .filter(function (d, i) {return data[i].value < 0;});

  tickNegative.select('line')
    .attr('x2', 6);

  tickNegative.select('text')
    .attr('x', 9)
    .style('text-anchor', 'start');
});

function type2(d) {
  d.value = +d.value;
  return d;
}