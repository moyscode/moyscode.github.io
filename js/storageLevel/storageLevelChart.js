/*
 *    class to create storage level line chart
 */

class StorageLevelChart {
  constructor(_chartLocation, _reservoirCategory, _data) {
    this.chartLocation = _chartLocation;
    this.reservoirCategory = _reservoirCategory;
    this.chartTitle = _reservoirCategory;
    this.data = _data;

    // console.log(reservoirCategory);

    this.initVis();
  }

  initVis() {
    const vis = this;

    d3.select(
      vis.reservoirCategory === ""
        ? "#Combined"
        : `#${vis.reservoirCategory}-svg`
    ).remove();

    vis.svg = d3
      .select(vis.chartLocation)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 600 500")
      .classed("svg-content", true)
      .attr(
        "id",
        vis.reservoirCategory === ""
          ? "Combined"
          : `${vis.reservoirCategory}-svg`
      );
    // .style("background-color", "red");
    // .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    // .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

    vis.g = vis.svg
      .append("g")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

    // X label
    vis.xLabel = vis.g
      .append("text")
      .attr("class", "x axis-label")
      .attr("x", WIDTH / 2 - 20)
      .attr("y", HEIGHT + 60)
      .attr("text-anchor", "middle")
      .text(vis.chartTitle === "" ? "Combined" : vis.chartTitle)
      .style("font-size", FONTSIZE["axis-label"]);

    // Y label
    vis.yLabel = vis.g
      .append("text")
      .attr("class", "y axis-label")
      .attr("x", -(HEIGHT / 2))
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Storage Level (%)")
      .style("font-size", FONTSIZE["axis-label"]);

    // Defining scale ranges (domains defined later)
    vis.x = d3.scaleTime().range([0, WIDTH - 60]);
    vis.y = d3.scaleLinear().range([HEIGHT, 0]);
    vis.color = d3.scaleOrdinal(d3.schemeCategory10);

    // function to create the line
    vis.line = d3
      .line()
      .curve(d3.curveLinear)
      .x((d) => vis.x(d.date))
      .y((d) => vis.y(d.storageLevel));

    vis.xAxis = vis.g
      .append("g")
      .attr("class", "x axis ")
      .attr("transform", "translate(0," + HEIGHT + ")");

    vis.yAxis = vis.g.append("g").attr("class", "y axis ");

    vis.xAxisCall = d3.axisBottom().tickFormat(d3.timeFormat("%e%b")).ticks(7);
    vis.yAxisCall = d3.axisLeft();

    vis.wrangleData();
  }
  // wrangleData method - selecting/filtering the data that we want to use.
  wrangleData() {
    const vis = this;

    // filter data based on selections

    vis.dataFiltered = getData(vis.data, vis.reservoirCategory);

    vis.allDates = Array.from(new Set(getValue(vis.dataFiltered, "date")));

    vis.updateVis();
  }

  updateVis() {
    const vis = this;

    vis.t = d3.transition().duration(1000);

    // update scales
    vis.x.domain(d3.extent(vis.allDates));

    vis.y.domain([
      d3.min(vis.dataFiltered, (c) => d3.min(c.values, (d) => d.storageLevel)) -
        20,
      d3.max(vis.dataFiltered, (c) => d3.max(c.values, (d) => d.storageLevel)),
    ]);

    vis.color.domain(vis.dataFiltered.map((c) => c.reservoir));

    // update axes
    vis.xAxisCall.scale(vis.x);
    vis.xAxis.transition(vis.t).call(vis.xAxisCall);
    vis.yAxisCall.scale(vis.y);
    vis.yAxis.transition(vis.t).call(vis.yAxisCall);

    vis.reservoir = vis.g
      .selectAll(".reservoir")
      .data(vis.dataFiltered)
      .enter()
      .append("g")
      .attr("class", "reservoir");

    vis.reservoir
      .append("path")
      .attr("id", (d) => `${d.reservoir}`)
      .attr("class", `line${vis.chartLocation}`)
      .attr("d", (c) => vis.line(c.values))
      .style("stroke", (d) => COLORS[d.reservoir])
      .style("fill", "none")
      .attr("stroke-width", "2px")
      .on("mouseover", function (d) {
        d3.select(this).attr("stroke-width", "4px"); //on mouseover of each line, give it a nice thick stroke
      })
      .on("mouseout", function (d) {
        d3.select(this).attr("stroke-width", "2px"); //on mouseout of each line, line is back to normal
      });

    vis.legendGroup = vis.svg
      .append("g")
      .attr("class", "legendGroup")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

    vis.legend = vis.legendGroup
      .selectAll(".legend")
      .data(vis.dataFiltered)
      .enter()
      .append("g")
      .attr("class", "legend");

    vis.legend
      .append("rect")
      .attr("id", (d) => `${d.reservoir}`)
      .attr("x", WIDTH - 55)
      .attr("y", (d, i) => i * 20)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", (d) => COLORS[d.reservoir]);

    vis.legend
      .append("text")
      .attr("id", (d) => `${d.reservoir}`)
      .attr("x", WIDTH - 40)
      .attr("y", (d, i) => i * 20 + 10)
      .attr("text-anchor", "left")
      .text((d) => d.reservoir)
      .style("font-size", FONTSIZE["legend-text"]);

    /******************************** Tooltip Code ********************************/
    vis.mouseG = vis.g.append("g").attr("class", "mouse-over-effects");

    vis.mouseG
      .append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    vis.mouseLineText = vis.mouseG
      .selectAll(".mouse-line-text")
      .data(vis.dataFiltered)
      .enter()
      .append("text")
      .attr("class", "mouse-line-text");

    vis.mousePerLine = vis.mouseG
      .selectAll(".mouse-per-line")
      .data(vis.dataFiltered)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    vis.mousePerLine
      .append("circle")
      .attr("r", 4)
      .style("stroke", (d) => COLORS[d.reservoir])
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    //CREATE HOVER TOOLTIP WITH VERTICAL LINE //
    vis.tooltip = d3
      .select(vis.chartLocation)
      .data(vis.dataFiltered)
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("background-color", "#f8f9fa")
      .style("padding", "5px")
      .style("display", "none")
      .style("pointer-events", "none");

    vis.mousePerLine.append("text").attr("transform", "translate(5,0)");
    vis.mouseG
      .append("svg:rect") // append a rect to catch mouse movements on canvas
      .attr("width", WIDTH - 57) // can't catch mouse events on a g element
      .attr("height", HEIGHT)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mouseout", function () {
        // on mouse out hide line, circles and text
        d3.select(vis.chartLocation)
          .select(".mouse-line")
          .style("opacity", "0");
        d3.select(vis.chartLocation)
          .selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.select(vis.chartLocation)
          .selectAll(".mouse-per-line text")
          .style("opacity", "0");
        d3.select(vis.chartLocation)
          .selectAll(".mouse-line-text")
          .style("opacity", "0");
        d3.select(vis.chartLocation)
          .selectAll("#tooltip")
          .style("display", "none");
      })
      .on("mouseover", function () {
        // on mouse in show line, circles and text
        d3.select(vis.chartLocation)
          .select(".mouse-line")
          .style("opacity", "1");
        d3.select(vis.chartLocation)
          .selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.select(vis.chartLocation)
          .selectAll(".mouse-per-line text")
          .style("opacity", "1");
        d3.select(vis.chartLocation)
          .selectAll(".mouse-line-text")
          .style("opacity", "1");
        d3.select(vis.chartLocation)
          .selectAll("#tooltip")
          .style("display", "block");
      })
      .on("mousemove", (event) => {
        vis.lines = document.getElementsByClassName(`line${vis.chartLocation}`);

        // mouse moving over canvas
        vis.mouse = d3.pointer(event);

        d3
          .select(vis.chartLocation)
          .selectAll(".mouse-per-line")
          .attr("transform", function (d, i) {
            (vis.xDate = vis.x.invert(vis.mouse[0])), /// use 'invert' to get date corresponding to distance from mouse position relative to svg
              (vis.bisect = d3.bisector(function (d) {
                return d.date;
              }).left),
              (vis.idx = vis.bisect(d.values, vis.xDate));

            d3.select(vis.chartLocation)
              .selectAll(".mouse-line")
              .attr("d", function () {
                vis.d = "M" + vis.x(d.values[vis.idx - 1].date) + "," + HEIGHT;
                vis.d += " " + vis.x(d.values[vis.idx - 1].date) + "," + 0;
                return vis.d;
              });

            return (
              "translate(" +
              vis.x(d.values[vis.idx - 1].date) +
              "," +
              vis.y(d.values[vis.idx - 1].storageLevel) +
              ")"
            );
          }),
          (vis.graphSVG = d3.select(vis.chartLocation).node());
        vis.mousePosition = d3.pointer(event, vis.graphSVG);
        d3.select(vis.chartLocation)
          .selectAll("#tooltip")
          .html((d, i) => {
            vis.xDate = d.values[vis.idx - 1].date;
            return vis.xDate.toLocaleDateString("pt-PT");
          })
          .style("display", "block")
          .style("left", vis.mousePosition[0] + "px")
          .style("top", vis.mousePosition[1] + "px")
          .style("font-size", FONTSIZE["tool-tip-header"])
          .style("padding-left", "10px")
          .selectAll()
          .data(vis.dataFiltered)
          .enter() // for each vehicle category, list out name and price of premium
          .append("div")
          .style("color", (d) => {
            return COLORS[d.reservoir];
          })
          .style("font-size", FONTSIZE["tool-tip-content"])
          .html((d, i) => {
            return (
              d.reservoir.substring(0, 3) +
              " " +
              d.values[vis.idx - 1].storageLevel +
              "%"
            );
          });
      });
  }
}
