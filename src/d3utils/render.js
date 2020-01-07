import * as d3 from "d3";

class GraphRender {
  draw_background(entry, data, position = "vertical") {
    entry
      .append("foreignObject")
      .attr("width", 320 * data.length)
      .attr("height", "1080")
      .append("xhtml:div")
      .attr(
        "style",
        `
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 1080px;
        background: #1c2436;
      `
      )
      .selectAll("empty")
      .data(data)
      .enter()
      .append("xhtml:div")
      .attr("class", "pie")
      .style("min-width", "320px")
      .style("min-height", "1080px")
      .style("background", (d, i) => (i % 2 === 0 ? "#1c2436" : "#181E2F"))
      .append("xhtml:p")
      // eslint-disable-next-line no-param-reassign
      .text((d, i) => ++i)
      // .attr("class", classes.pieDigit)
      .attr(
        "style",
        `
        position: relative;
        width: 40px;
        height: 84px;
        left: 16px;
        top: 0px;
  
        font-family: "Roboto";
        font-style: normal;
        font-weight: bold;
        font-size: 64px;
        line-height: 84px;
  
        color: #5A6487;
        opacity: 0.08;
        user-select: none;
      `
      )
      .exit();
  }

  draw_collapsed(entry, number) {
    g = entry
      .append("g")
      .style("background", "#171e2f")
      .attr("width", "112")
      .attr("height", "56")
      .attr("fill", "none");

    g.data([
      { opacity: "0.2", cx: "49", fill: "#20263E" },
      { opacity: "0.5", cx: "41", fill: "#20263E" },
      { opacity: "1", cx: "33", fill: "#181E2F" }
    ])
      .join("circle")
      .attr("opacity", d => d.opacity)
      .attr("cx", d => d.cx)
      .attr("cy", "28")
      .attr("r", "27")
      .attr("fill", d => d.fill)
      .attr("stroke", "#5A6487")
      .attr("stroke-width", "2");

    g.append("circle")
      .attr("cx", "7")
      .attr("cy", "28")
      .attr("r", "5.5")
      .attr("fill", "#5A6487")
      .attr("stroke", "#181E2F")
      .attr("stroke-width", "3");

    g.append("path")
      .attr(
        "d",
        "M94.308 17.816C94.4387 17.5453 94.5787 17.312 94.728 17.116C94.8773 16.92 95.0873 16.7007 95.358 16.458L96.828 15.114L98.06 16.402L93.3 20.714L88.54 16.402L89.772 15.114L91.242 16.458C91.5127 16.7007 91.7227 16.92 91.872 17.116C92.0213 17.312 92.1613 17.5453 92.292 17.816V10.844H94.308V17.816Z"
      )
      .attr("fill", "#859DE0");

    g.append("path")
      .attr(
        "d",
        "M92.292 39.028C92.1613 39.2987 92.0213 39.532 91.872 39.728C91.7227 39.924 91.5127 40.1433 91.242 40.386L89.772 41.73L88.54 40.442L93.3 36.13L98.06 40.442L96.828 41.73L95.358 40.386C95.0873 40.1433 94.8773 39.924 94.728 39.728C94.5787 39.532 94.4387 39.2987 94.308 39.028V46H92.292V39.028Z"
      )
      .attr("fill", "#5BB95B");

    // TODO append numbers
  }
}

export default GraphRender;
