let req = new XMLHttpRequest();
req.open(
  "GET",
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
);
req.send();
req.onload = function() {
  let json = JSON.parse(req.responseText);
  let data = json.monthlyVariance;
  let base = json.baseTemperature;
  let month = [];
  for (var i = 0; i < 12; i++) {
    month.push(d3.timeFormat("%B")(new Date(1970, i, 1)));
  }
  let colors = [
    "#0000FF",
    "#0A47A9",
    "#0365CC",
    "#039BE5",
    "#4FC3F7",
    "#B2EBF2",
    "#FFFF8D",
    "#FFEA33",
    "#FFC400",
    "#FF7100",
    "#FF3100",
    "#FF0012"
  ];
  let values = [2.7, 3.7, 4.7, 5.7, 6.7, 7.7, 8.7, 9.7, 10.7, 11.7, 12.7, 14];
  const dExt = d3.extent(data, d => d.year);
  const w = 1800;
  const h = 900;
  const padding = 150;
  const paddingTop = 50;
  const h1 = d3
    .select("body")
    .append("h1")
    .attr("id", "title")
    .text("Monthly Global Land-Surface Temperature");
  const h2 = d3
    .select("body")
    .append("h2")
    .attr("id", "description")
    .text(`${dExt[0]} - ${dExt[1]}: base temperature ${base}℃`);
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
  const tool = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip");
  const xScale = d3
    .scaleLinear()
    .domain([dExt[0] - 0.1, dExt[1]])
    .range([padding, w - padding]);
  const yScale = d3
    .scaleBand()
    .domain(month.map((d, i) => i))
    .range([paddingTop, h - padding]);
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(Math.round((dExt[1] - dExt[0]) / 10))
    .tickFormat(d => d)
    .tickSize(10);
  const yAxis = d3
    .axisLeft()
    .scale(yScale)
    .tickFormat((d, i) => month[i])
    .tickSize(10);
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${h - padding})`)
    .call(xAxis);
  svg
    .append("text")
    .attr("x", w / 2)
    .attr("y", h - padding * 0.6)
    .text("Years");
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding},0)`)
    .call(yAxis);
  svg
    .append("text")
    .attr("x", padding / 2)
    .attr("y", h / 2)
    .attr("transform", `rotate(-90,${padding / 2},${h / 2})`)
    .text("Months");
  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", d => d.month - 1)
    .attr("data-year", d => d.year)
    .attr("data-temp", d => base + d.variance)
    .attr("width", d => (w - padding * 2) / (dExt[1] - dExt[0]))
    .attr("height", yScale.bandwidth())
    .attr("x", (d, i) => xScale(d.year))
    .attr("y", (d, i) => yScale(d.month - 1))
    .style("fill", (d, i) => {
      let temp = base + d.variance;
      for (let i = 0; i < values.length; i++) {
        if (temp <= values[i]) {
          return colors[i];
        }
      }
    })
    .on("mouseover", function(d) {
      tool
        .style("display", "block")
        .attr("data-year", d.year)
        .style("top", +this.getAttribute("y") + 110 + "px")
        .style("left", +this.getAttribute("x") + 25 + "px")
        .html(
          `<span>${month[d.month - 1]} ${d.year}</span><br><span>${(
            base + d.variance
          ).toFixed(2)}℃</span><br><span>${d.variance.toFixed(2)}</span>`
        );
      this.style.strokeWidth = "2px";
    })
    .on("mouseout", function(d) {
      tool.style("display", "none");
      this.style.strokeWidth = 0;
    });
  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${padding},${h - padding / 2})`);
  legend
    .selectAll("rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("width", 30)
    .attr("height", 30)
    .attr("transform", (d, i) => `translate(${40 * i},0)`)
    .attr("fill", d => d);
  legend
    .selectAll("text")
    .data(values)
    .enter()
    .append("text")
    .attr("x", (d, i) => 40 * i + 15)
    .attr("y", 50)
    .text(d => d);
};
