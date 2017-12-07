//
// LINE CHART
//

var chart1 = d3.select("#svg-1"),
    margin1 = {top: 50, right: 60, bottom: 30, left: 50},
    width1 = chart1.attr("width") - margin1.left - margin1.right,
    height1 = chart1.attr("height") - margin1.top - margin1.bottom;

var parseDate = d3.timeParse("%Y");

var x_1 = d3.scaleTime().range([0, width1]),
    y_1 = d3.scaleLinear().range([height1, 0]),
    z_1 = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x_1(d.date); })
    .y(function(d) { return y_1(d.approvals); })


d3.csv("h1b_country_10.csv", type1, function(error, data) {
  if (error) throw error;

  var dataAll = data.columns.slice(1).map(function(id) {
    return {
      id: id,
      values: data.map(function(d) {
        return {date: d.date, approvals: d[id]};
      })
    };
  });
  
  var g1 = chart1.append("g")
      .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

  console.log(data)

  x_1.domain(d3.extent(data, function(d) { return d.date; }));
  y_1.domain([
    d3.min(dataAll, function(c) { return d3.min(c.values, function(d) { return d.approvals; }); }),
    d3.max(dataAll, function(c) { return d3.max(c.values, function(d) { return d.approvals; }); })
    ]);
  z_1.domain(dataAll.map(function(c) { return c.id; }));

  g1.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height1 + ")")
    .call(d3.axisBottom(x_1))
    .attr("id", "xAxis");

  g1.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y_1))
      .attr("id", "yAxis")
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("# of H1-B Approvals");

  var paths = g1.append("g").attr("id", "gCountries")
    .selectAll(".countryLine")
    .data(dataAll, function(d){return d.id})
    .enter().append("path")
    .attr("class", "countryLine line")
    .attr("d", function(d) { return line(d.values); })
    .attr("id", function(d){return d.id})
    .style("stroke", function(d) { return z_1(d.id); });

  var totalLength = paths.node().getTotalLength();

  paths
    .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition().duration(4000) 
      .ease(d3.easeLinear) 
      .attr("stroke-dashoffset", 0);

  paths.select(".countryLine")
    .append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x_1(d.value.date) + "," + y_1(d.value.approvals) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });
});

// // UPDATE DATA????
function updateData() {
   d3.csv("h1b_country_10_I.csv", type1, function(error, data) {
     if (error) throw error;

     var dataPlus = data.columns.slice(1).map(function(id) {
       return {
         id: id,
         values: data.map(function(d) {
           return {date: d.date, approvals: d[id]};
           })
         };
       });

     y_1.domain([
       d3.min(dataPlus, function(c) { return d3.min(c.values, function(d) { return d.approvals; }); }),
       d3.max(dataPlus, function(c) { return d3.max(c.values, function(d) { return d.approvals; }); })
       ]);
     z_1.domain(dataPlus.map(function(c) { return c.id; }));

     // console.log(dataPlus);

    d3.selectAll(".countryLine")
      .transition().duration(2000)
      .attr("d", function(d) { return line(d.values); });

    countryUpdate = d3.select("#gCountries").selectAll(".countryLine")
      .data(dataPlus, function(d){ return d.id; })
      .enter();

    pathUpdate = countryUpdate.append("path")
      .attr("id", function(d) { return d.id;})
      .attr("class", "countryLine line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return z_1(d.id); });

    d3.selectAll(".countryLine")
      .transition().duration(2000)
      .attr("d", function(d) { return line(d.values); });

    d3.select("#yAxis")
      .transition().duration(2000)
      .call(d3.axisLeft(y_1));

    var totalLengthUpdate = pathUpdate.node().getTotalLength();

    pathUpdate
      .attr("stroke-dasharray", totalLengthUpdate + " " + totalLengthUpdate )
        .attr("stroke-dashoffset", totalLengthUpdate )
        .transition().duration(4000) 
        .ease(d3.easeLinear) 
        .attr("stroke-dashoffset", 0);

   });
 };

function type1(d, _, columns) {
  d.date = parseDate(d.date);
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}