//
// TREEMAP
//

var chart2 = d3.select("#svg-2"),
    headline = "Number of H1-B Certifications in",
    subtitle = "[Click on the slider to change year of observation (2014 - 2016)]"
    width2 = chart2.attr("width"),
    height2 = chart2.attr("height");

var company_size = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); },
    color = d3.scaleOrdinal()
              .range(["#848b8e", "#88A61B" , "#F29F05", "#F25C05", "#D92525"])
              .domain(company_size),
    format = d3.format(",d");

var treemap = d3.treemap()
    .tile(d3.treemapResquarify)
    .size([width2/1.5, height2])
    .round(true)
    .paddingInner(2);


d3.select("#slider").insert("p", ":first-child").append("input")
    .attr("type", "range")
    .attr("min", "2014")
    .attr("max", "2016")
    .attr("value", 2014)
    .attr("id", "sliderControl");

d3.select("#slider").insert("h6", ":first-child").text(subtitle);
d3.select("#slider").insert("h4", ":first-child").text(headline + " " + 2014);


var cell; 

// Reading Data
d3.json("company_size.json", function(error, data) {
  if (error) throw error;

  // Initialize data
  var root = d3.hierarchy(data[0])
      .eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;})
      .sum(function(d){return d.size})
      .sort(function(a, b) { return b.height2 - a.height2 || a.value - b.value; });

  // Make treemap object and call the make treemap function 
  treemap(root);
  makeTreemap(root);

  // On Select: Calling Update Function
  d3.select("#sliderControl").on("input", function() {
    var index = this.value - 2014;
    var currentData = data[index];

    document.querySelector("#slider h4").innerHTML = headline + " " + this.value;

    var newRoots = d3.hierarchy(currentData)
      .eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
      .sum(function(d){return d.size})
      .sort(function(a, b) { return b.height2 - a.height2 || a.value - b.value; });

    changed(newRoots);
    updateBar(this.value);
  });
});

// FUNCTIONS
// Builder Function
  function makeTreemap(rt) {
    var cell = chart2.selectAll("g")
      .data(rt.leaves())
      .enter().append("g")
      .attr("id", function(d) { return d.data.id; })
      .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

    cell.append("rect")
        .attr("id", function(d) { return d.data.id; })
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .attr("fill", function(d) { return color(d.parent.data.id); });

    cell.append("title")
        .text(function(d) { return d.data.id+ "\n" + format(d.value); });


    cell.append("text")
        .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
      .selectAll("tspan")
        .data(function(d) { return d.data.name.split(/(?=\s[A-Z])/g); })
      .enter().append("tspan")
        .attr("x", 4)
        .attr("y", function(d, i) { return 13 + i * 10; })
        .text(function(d) { return d; })
      .attr("id", "nodeTitle");


  };

  // Update Function
    function changed(roots) {
      treemap(roots);

      cell2 = chart2.selectAll("g")
          .data(roots.leaves())
          .attr("id", function(d) { return d.data.id; })
          .transition().duration(750)
            .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; })
          .select("rect")
            .attr("id", function(d) { return d.data.id; })
            .attr("width", function(d) { return d.x1 - d.x0; })
            .attr("height", function(d) { return d.y1 - d.y0; })
          .select("title").text(function(d) { return d.data.id+ "\n" + format(d.value); })
;
      
      
    }