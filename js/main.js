const height = 550;
const width = 800;
const margin = {
  top: 50,
  right: 50, 
  bottom: 50, 
  left: 50
}

const body = d3.select("body");

// body.append("div").attr("style", "background-color: red; height: 50px")

const tooltip = body.append("div");

  tooltip
    .attr("id", "tooltip")
    .attr("style",
      `background-color: rgb(50, 50, 50);
      // border: 1px solid gold;
      color: white;
      font-weight: bold;
      // outline: 1px solid black;
      padding: 10px;
      position: absolute;
      min-height: 50px; 
      min-width: 50px;
      z-index: 3;
      opacity: 0`);

const scatterplot = body.append("svg");

scatterplot
  .attr("id", "scatterplot")
  // .attr("height", height)
  // .attr("width", width)
  .attr("viewBox", [0, 0, width, height]);

const title = scatterplot.append("text");

title
  .attr("id", "title")
  .attr("fill", "black")
  .attr("font-size", "24px")
  .text("Doping in Professional Bicycle Racing")
  // .attr("width", "400px")
  // .attr("x", "50%")
  .attr("text-anchor", "middle")
  // .attr("x", width / 2)
  .attr("x", "50%")
  .attr("y", 20);

const subtitle = scatterplot.append("text");

subtitle
  .attr("id", "subtitle")
  .text("35 Fastest times up Alpe d'Huez")
  .attr("font-size", "18px")
  .attr("fill", "black")
  .attr("text-anchor", "middle")
  .attr("x", "50%")
  .attr("y", 40);

const legend = scatterplot.append("g");

legend
  .attr("id", "legend")
  // .attr("height", 400)
  // .attr("fill", "red")
  // .attr("color", "red")
  // .attr("stroke", "green")
  .attr("transform", `translate(${width - 40}, ${height / 2})`);

legend
  .append("rect")
  .attr("height", 24)
  .attr("width", 24)
  .attr("stroke", "black")
  .attr("fill", "white")
  .attr("x", 8)
  .attr("y", 18)
  // .append("circle")
  // .attr("r", 12)
  // .attr("stroke", "black")
  // .attr("cx", 24)
  // .attr("cy", -6)

legend
  .append("rect")
  .attr("height", 24)
  .attr("width", 24)
  .attr("fill", "rgb(195, 0, 0)")
  .attr("stroke", "black")
  .attr("x", 8)
  .attr("y", -18)

legend
  .append("text")
  // .attr("font-size", "21px")
  // .style("font-weight", "bold")
  .text("Alleged Doping Allegations")
  .attr("text-anchor", "end")
  .attr("transform", "translate(0, 0)");

legend
  .append("text")
  .text("No Alleged Doping Allegations")
  .attr("text-anchor", "end")
  .attr("transform", "translate(0, 36)")

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

// fetch(url).then(responseData => responseData.json()).then(
//   responseData => console.log(responseData[0].Name)
// )

const parseTime = d3.timeParse("%M:%S");
const parseYear = d3.timeParse("%Y");
// const timeFormatLocale = d3.timeFormatLocale("%M:%S");
const formatTime = d3.timeFormat("%M:%S")

d3.json(
  url,
  function (error, data) {
    
    if (error) throw error
 
    return data
  }
)
  .then(
  function (data) {
    // const yScaleTime = d3.scaleLinear();
    const yScaleTime = d3.scaleTime();
      
    yScaleTime
      .domain([d3.min(data, (d, i) => parseTime(d["Time"])), d3.max(data, (d, i) => parseTime(d["Time"]))])
      .range([height - margin.bottom, margin.top]);
        
    const yAxis = d3.axisLeft(yScaleTime).tickFormat(formatTime).tickPadding(5).tickSize(15);
   
    scatterplot
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", "translate(" + margin.right + ", 0)")
      .call(yAxis);
    
    const xScaleTime = d3.scaleTime();
    
    xScaleTime
      // .domain([d3.min(data, d => parseYear(d.Year)), d3.max(data, d => parseYear(d.Year))])
    // .domain([d3.min(data, d => (d.Year)) - 2, d3.max(data, d => (d.Year))])
    
      .domain([d3.min(data, d => parseYear(d.Year)), d3.max(data, d => parseYear(d.Year))])
    // .domain([parseYear(1992), d3.max(data, d => parseYear(d.Year))])
      .range([margin.left, width - margin.right]);
    
    // const tickLabels = [1992, 1994, 1996, 1998, 2000, 2002, 2004, 2006, 2007, 2008, 2010, 2012, 2014, 2016]
    
    const xAxis = d3.axisBottom(xScaleTime)  // Axis Generator
    // .ticks(14)
    .tickPadding(5)
    // .ticks(d3.timeYear.every(2))
    // .tickArguments(d3.timeYear.every(4))
    .tickSize(15)
    // .tickSizeOuter(4)
    // 
    // .ticknice
    // .tickFormat((d, i) => tickLabels[i])
    // .tickValues(tickLabels.map(i=>parseYear(i)))
    // .tickValues(xScaleTime.ticks().concat(xScaleTime.domain()[0]));// take off [0] or change it to [1] to add a value to the last tick. I may take it off. resume hear when ready. 
    // .tickValues(xScaleTime[0] = "")
    // .tickValues(["1992", "1994", '1996', '1998', '2000', '2004', '2008', '2010', '2012', '2014', "2046"])
    // xAxis.selectAll(".tick text").attr("font-size", "21px")
    
    scatterplot
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(${0}, ${height - margin.bottom})`)
      .call(xAxis)
      // .call(xAxis.ticks(7))
      ;
    
    // transform th e tick text color and etc after they are called
    
    
    
    scatterplot
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("stroke", "black")
      // .attr("fill", "black")
      .attr("stroke-width", 1)
      .attr("fill", d => { return d["Doping"] === "" ? "white" : "rgb(195, 0, 0)"})
      .attr("class", "dot")
      .attr("r", 12)
      .attr("data-xvalue", d => parseYear(d.Year))
      // .attr("data-xvalue", d => parseYear(d.Year).getFullYear())
      .attr("data-yvalue", d => parseTime(d.Time))
      // .attr("data-yvalue", d => parseTime(d.Time).getMinutes() + ":" + parseTime(d.Time).getSeconds())
      .attr("cx", d => xScaleTime(parseYear(d.Year)))
      .attr("cy", d => yScaleTime(parseTime(d.Time)))
    
      .on("mouseover", function(d) {
        d3.select("#tooltip")
          .style("opacity", 1)
          .style("transition-duration", 200)
          .attr("data-year", d3.select(this).attr("data-xvalue"))
          // Resume here when ready. I don't know why am I getting null for the data-year attr
          
         d3.select("#tooltip")
          .html(
            `Year: ${new Date(tooltip.attr("data-year")).getFullYear()}
            <br/>
            Time: ${new Date(d3.select(this).attr("data-yvalue")).getMinutes() + ":" + new Date(d3.select(this).attr("data-yvalue")).getSeconds()}`)
          
      })
    
      .on("mousemove", (d) => {
      d3.select("#tooltip")
        .style("top", (event.pageY - 20)+ "px")
        .style("left", (event.pageX + 20) + "px")
      })
    
      .on("mouseout", () => {
        d3.select("#tooltip")
          .style("opacity", 0)
      })
    
    // Remember, my yAxis is counting upward, while the example codepen is counting downward. 
  }
);

 
// d3.selectAll(".tick").attr("fill", "red")

