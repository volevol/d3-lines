const width = 190;
const height = 50;

const curveArray = [
  { d3Curve: d3.curveMonotoneX, curveTitle: "curveMonotoneX" },
];

const parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");

const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

const valueline = d3.line().curve(d3.curveCatmullRomOpen);

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

d3.csv("market-price.csv", (error, data) => {
  if (error) throw error;

  data.forEach((d) => {
    d.Timestamp = parseTime(d.Timestamp);
    d["market-price"] = +d["market-price"];
  });

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  curveArray.forEach((daCurve, i) => {
    x.domain(d3.extent(data, (d) => d.Timestamp));
    y.domain(d3.extent(data, (d) => d["market-price"]));

    

      svg.append("linearGradient")
      .attr("id", "line-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", y(0))
      .attr("x2", 0)
      .attr("y2", y(height))
      .selectAll("stop")
        .data([
          {offset: "0%", color: "blue"},
          {offset: "100%", color: "red"}
        ])
      .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; }); 
        
        svg
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("stroke", "url(#line-gradient)" )
        .style("stroke", () => (daCurve.color = color(daCurve.curveTitle)))
        .attr("id", "tag" + i)
        .attr(
          "d",
          d3
            .line()
            .x((d) => x(d.Timestamp))
            .y((d) => y(d["market-price"]))
        );
  });
});
