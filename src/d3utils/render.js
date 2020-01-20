import * as d3 from "d3";
import { isNull } from "util";
import types from "./types";

class GraphRender {
  constructor() {
    Array.prototype.equals = function(array) {
      // if the other array is a falsy value, return
      if (!array) return false;

      // compare lengths - can save a lot of time
      if (this.length !== array.length) return false;

      for (let i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
          // recurse into the nested arrays
          if (!this[i].equals(array[i])) return false;
        } else if (this[i] !== array[i]) {
          // Warning - two different object instances will never be equal: {x:20} != {x:20}
          return false;
        }
      }
      return true;
    };
  }

  draw_background(entry, data, isVertical = false) {
    entry
      .append("foreignObject")
      .attr("width", 320 * data.length)
      .attr("height", 240 * data.length)
      .append("xhtml:div")
      .attr(
        "style",
        `
        display: flex;
        width: 100%;
        height: 100%;
        background: #1c2436;
      `
      )
      .style("flex-direction", isVertical ? "column" : "row")
      .selectAll("empty")
      .data(data)
      .enter()
      .append("xhtml:div")
      .attr("class", "pie")
      .style("min-width", isVertical ? "100%" : "320px")
      .style("min-height", isVertical ? "240px" : "100%")
      .style("background", (d, i) => (i % 2 === 0 ? "#1c2436" : "#181E2F"))
      .append("xhtml:p")
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

  draw_nodes_by_lvl_index(entry, data) {
    const g = entry
      .append("g")
      .attr("class", "nodes")
      .selectAll("empty")
      .data(data)
      .join("g")
      .attr("id", d => d.pk)
      .attr("transform", d => {
        const x = 320 * (d.lvl - 1) + 50;
        const y = 86 + d.lvlIndex * 80;

        return `translate(${x}, ${y})`;
      })
      .attr("fill", "none")
      .attr("width", "220")
      .attr("height", "64")
      .attr("viewBox", "0 0 220 64");

    g.append("rect")
      .attr("x", "7")
      .attr("y", "1")
      .attr("width", "218")
      .attr("height", "62")
      .attr("rx", d => (d.status === 2 ? "16" : "32"))
      .attr("stroke", "#5A6487")
      .attr("stroke-width", "2");

    g.filter(d => d.leaf === "false")
      .append("circle")
      .attr("class", "right")
      .attr("cx", "225")
      .attr("cy", "32")
      .attr("r", "5.5")
      .attr("fill", "#5A6487")
      .attr("stroke", "#181E2F")
      .attr("stroke-width", "3");

    g.filter(d => d.root === "false")
      .append("circle")
      .attr("class", "left")
      .attr("cx", "7")
      .attr("cy", "32")
      .attr("r", "5.5")
      .attr("fill", "#5A6487")
      .attr("stroke", "#181E2F")
      .attr("stroke-width", "3");

    const container = g
      .append("foreignObject")
      .attr("x", "7")
      .attr("y", "1")
      .attr("width", "218")
      .attr("height", "62")
      .append("xhtml:div")
      .style("width", "100%")
      .style("height", "100%")
      .style("display", "flex")
      .style("flex-direction", "row")
      .style("justify-content", "space-around")
      .style("align-items", "center");
    container
      .append("xhtml:p")
      .style("color", "#fff")
      .style("max-width", "50%")
      .text(d => `${d.inn} ${d.parent && d.parent.inn}`);
    container
      .append("xhtml:p")
      .style("color", "#fff")
      .style("max-width", "30%")
      .text(d => (d.isDuplicate ? "dupl" : "main"));
  }

  draw_nodes_by_coords(entry, data, draw_highlighted) {
    const g = entry
      .append("g")
      .attr("class", "nodes")
      .selectAll("empty")
      .data(data.filter(node => !node.isMegaNode))
      .join("g")
      .attr("id", d => d.pk)
      .attr("transform", d => {
        const x = d.x;
        const y = d.y;

        return `translate(${x}, ${y})`;
      })
      .attr("fill", "none")
      .attr("width", d => (d.status === 2 && d.level ? "64" : "220"))
      .attr("height", "64")
      .attr("viewBox", "0 0 220 64")
      .on("click", function(d) {
        draw_highlighted(d.lvl, d.lvlIndex);
      });

    g.append("rect")
      // .attr("x", "7")
      .attr("x", d =>
        d.status === 2 && d.level && isNull(d.joints.left) ? "163" : "7"
      )
      .attr("y", "1")
      .attr("width", d => (d.status === 2 && d.level ? "62" : "218"))
      .attr("height", "62")
      .attr("rx", d => (d.status === 2 ? "16" : "32"))

      .attr("stroke", "#5A6487")
      .attr("stroke-width", "2");

    g.filter(d => !isNull(d.joints.right))
      .append("circle")
      .attr("class", "right")
      .attr("cx", "225")
      .attr("cy", "32")
      .attr("r", "5.5")
      .attr("fill", "#5A6487")
      .attr("stroke", "#181E2F")
      .attr("stroke-width", "3");

    g.filter(d => !isNull(d.joints.left))
      .append("circle")
      .attr("class", "left")
      .attr("cx", "7")
      .attr("cy", "32")
      .attr("r", "5.5")
      .attr("fill", "#5A6487")
      .attr("stroke", "#181E2F")
      .attr("stroke-width", "3");

    g.filter(d => !isNull(d.joints.leftUp))
      .append("circle")
      .attr("cx", "29")
      .attr("cy", "1")
      .attr("r", "5.5")
      .attr("fill", "#5A6487")
      .attr("stroke", "#181E2F")
      .attr("stroke-width", "3");

    g.filter(d => !isNull(d.joints.leftDown))
      .append("circle")
      .attr("cx", "29")
      .attr("cy", "63")
      .attr("r", "5.5")
      .attr("fill", "#5A6487")
      .attr("stroke", "#181E2F")
      .attr("stroke-width", "3");

    g.filter(d => !isNull(d.joints.rightUp))
      .append("circle")
      .attr("cx", "203")
      .attr("cy", "1")
      .attr("r", "5.5")
      .attr("fill", "#5A6487")
      .attr("stroke", "#181E2F")
      .attr("stroke-width", "3");

    g.filter(d => !isNull(d.joints.rightDown))
      .append("circle")
      .attr("cx", "203")
      .attr("cy", "63")
      .attr("r", "5.5")
      .attr("fill", "#5A6487")
      .attr("stroke", "#181E2F")
      .attr("stroke-width", "3");

    const container = g
      .append("foreignObject")
      .attr("x", d =>
        d.status === 2 && d.level && isNull(d.joints.left) ? "163" : "7"
      )
      .attr("y", "1")
      .attr("width", d => (d.status === 2 && d.level ? "62" : "218"))
      .attr("height", "62")
      .style("border-radius", d => (d.status === 2 ? "16px" : "32px"))
      .style("box-shadow", d => (d.isHighlighted ? "0px 0px 18px #91A4F3" : ""))
      .append("xhtml:div")
      .style("width", "100%")
      .style("height", "100%")
      .style("display", "flex")
      .style("flex-direction", "row")
      .style("justify-content", "space-around")
      .style("align-items", "center")
      .style("user-select", "none")
      .style("margin", d => (d.status === 2 && d.level ? "0" : "0 5px"));

    const balance_box = container
      .filter(d => d.lvl > 1 && d.status === 1)
      .append("xhtml:div")
      .attr(
        "style",
        `
          display: flex;
          flex-direction: column;
          width: 34px;
          height: 35px;
          align-items: center;
          justify-content: space-between;
        `
      );
    const balance_svg = balance_box
      .append("svg")
      .attr("width", "16")
      .attr("height", "16");

    balance_svg
      .append("path")
      .attr("fill", "#859DE0")
      .attr(
        "d",
        "M8.2222 8.37621L7.54199 8.76984V15.8459L13.667 12.3094V5.2334L8.2222 8.37621Z"
      );
    balance_svg
      .append("path")
      .attr("fill", "#859DE0")
      .attr(
        "d",
        "M9.33029 2.03056L6.97475 0.666992L0.679688 4.30106L3.03837 5.66462L9.33029 2.03056Z"
      );
    balance_svg
      .append("path")
      .attr("fill", "#859DE0")
      .attr(
        "d",
        "M13.2672 4.30109L10.5527 2.75488L4.26074 6.38895L4.61974 6.57475L6.97527 7.93516L9.31821 6.5842L13.2672 4.30109Z"
      );
    balance_svg
      .append("path")
      .attr("fill", "#859DE0")
      .attr(
        "d",
        "M3.78492 8.9896L2.65754 8.41017V6.60888L0.333496 5.27051V12.2962L6.41442 15.8074V8.78176L3.78492 7.26704V8.9896Z"
      );

    balance_box
      .append("xhtml:p")
      .attr(
        "style",
        `
          font-family: Fira Sans;
          font-style: normal;
          font-weight: bold;
          font-size: 14px;
          line-height: 18px;
          color: #fff
        `
      )
      .text(d => d.balance);

    container
      .filter(d => types[d.type] !== undefined)
      .append("xhtml:div")
      .style("color", "#fff")
      // .style("max-width", "30%")
      .style("max-width", d => (d.status === 2 && d.level ? "100%" : "30%"))
      // .style("margin-left", "10px")
      .html(d => {
        if (d.type === 18 || d.type === 7 || d.type === 19)
          return types[d.type][d.co_code];

        return types[d.type];
      });
    container
      .filter(d => d.status === 1 || d.level === 0)
      .append("xhtml:p")
      .attr(
        "style",
        `
          font-family: Fira Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 18px;
        `
      )
      .style("color", "#fff")
      .style("white-space", "pre-line")
      .text(d => `${d.short_name} \n ${d.level === 0 ? "" : d.inn}`);
  }

  draw_meganodes(entry, data) {
    const g = entry
      .append("g")
      .attr("class", "meganodes")
      .selectAll("empty")
      .data(data.filter(node => node.isMegaNode))
      .join("g")
      .style("background", "#171e2f")
      .attr("width", "112")
      .attr("height", "56")
      .attr("transform", d => {
        const x = d.x;
        const y = d.y + 4;

        return `translate(${x}, ${y})`;
      })
      .attr("fill", "none");

    g.append("circle")
      .attr("opacity", "0.2")
      .attr("cx", "49")
      .attr("cy", "28")
      .attr("r", "27")
      .attr("fill", "#20263E")
      .attr("stroke", "#5A6487")
      .attr("stroke-width", "2");
    g.append("circle")
      .attr("opacity", "0.5")
      .attr("cx", "41")
      .attr("cy", "28")
      .attr("r", "27")
      .attr("fill", "#20263E")
      .attr("stroke", "#5A6487")
      .attr("stroke-width", "2");
    g.append("circle")
      .attr("opacity", "1")
      .attr("cx", "33")
      .attr("cy", "28")
      .attr("r", "27")
      .attr("fill", "#181E2F")
      .attr("stroke", "#5A6487")
      .attr("stroke-width", "2");

    g.append("circle")
      .attr("cx", "7")
      .attr("cy", "28")
      .attr("r", "5.5")
      .attr("fill", "#5A6487")
      .attr("stroke", "#181E2F")
      .attr("stroke-width", "3");

    g.append("foreignObject")
      .attr("width", "25")
      .attr("height", "18")
      .attr("x", "84")
      .attr("y", "6")
      .append("xhtml:p")
      .attr("class", "arrow-down")
      .text(d => `${d.countNodes() - d.countLeaf()}`);

    g.append("foreignObject")
      .attr("width", "25")
      .attr("height", "18")
      .attr("x", "84")
      .attr("y", "32")
      .append("xhtml:p")
      .attr("class", "arrow-up")
      .text(d => `${d.countNodes()}`);

    g.append("foreignObject")
      .attr("width", "20")
      .attr("height", "28")
      .attr("x", "20")
      .attr("y", "14")
      .append("xhtml:p")
      .attr("class", "meganode-number")
      .text(d => `${d.countNodes()}`);
  }

  draw_edges_old(entry, data = "nodes") {
    const nodes = data.filter(node => node.parent);
    const links = entry
      .append("g")
      .attr("class", "edges")
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .selectAll("empty")
      .data(nodes)
      .join("g");

    links
      .append("path")
      .attr("stroke", "#5A6487")
      .attr("d", d => {
        const c = d3.path();
        const x1 = 320 * (d.lvl - 1) + 50;
        const y1 = 86 + d.lvlIndex * 80;
        // const p = this.nodes.getNode(this.edges.getEdgeByChild(d.pk).bid);
        const x2 = 320 * (d.parent.lvl - 1) + 50;
        const y2 = 86 + d.parent.lvlIndex * 80;

        c.moveTo(x1, y1);
        c.lineTo(x2, y2);

        return c;
      });
  }

  draw_edges_by_parents(entry) {
    const data = this.nodes.getAll().filter(node => node.parent);
    // const data =
    const links = entry
      .append("g")
      .attr("class", "edges")
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .selectAll("empty")
      .data(data)
      .join("g");

    links
      .append("path")
      .attr("stroke", "#5A6487")
      .attr("d", d => {
        const c = d3.path();

        c.moveTo(d.x + 7, d.y + 32);
        c.lineTo(d.parent.x + 227, d.parent.y + 32);

        return c;
      });
  }

  draw_edges_by_joints(entry, paths) {
    const links = entry
      .append("g")
      .attr("class", "edges")
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .selectAll("empty")
      .data(paths)
      .join("g");

    links
      .append("path")
      .attr("stroke", "#5A6487")
      .attr("d", d => {
        const c = d3.path();

        if (d.type === "vertical") {
          c.moveTo(d.source.x, d.source.y);
          c.lineTo(d.target.x, d.target.y);
        }

        if (d.type === "horizontal") {
          const s = d.source;
          const t = d.target;
          const siblings = paths.filter(
            path => path.source.x === d.source.x && path.source.y === d.source.y
          );

          c.moveTo(s.x + 5, s.y);
          if (
            siblings
              .filter(path => path.target.y > d.source.y)
              .equals(siblings) ||
            siblings.filter(path => path.target.y < d.source.y).equals(siblings)
          ) {
            const sign = t.y > s.y ? 1 : -1;
            c.bezierCurveTo(
              s.x + 5,
              s.y,
              s.x + 20,
              s.y,
              s.x + 20,
              s.y + 15 * sign
            );
          } else {
            c.lineTo(s.x + 20, s.y);
          }

          if (s.y !== t.y) {
            const sign = t.y < s.y ? 1 : -1;
            c.lineTo(s.x + 20, t.y + 15 * sign);

            c.bezierCurveTo(
              s.x + 20,
              t.y + 15 * sign,
              s.x + 20,
              t.y,
              s.x + 20 + 15,
              t.y
            );
          }

          c.lineTo(t.x - 5, t.y);
        }

        return c;
      });
    links
      .append("foreignObject")
      .attr("x", d =>
        d.type === "vertical" ? d.source.x + 8 : d.source.x + 32
      )
      .attr("y", d =>
        d.type === "vertical"
          ? (d.target.y + d.source.y) / 2 - 9
          : d.target.y - 20
      )
      .attr("width", "100")
      .attr("height", "18")
      .append("xhtml:p")
      .attr(
        "style",
        `
          font-family: Fira Sans;
          font-style: normal;
          font-weight: bold;
          font-size: 14px;
          line-height: 18px;
          text-align: left;
        `
      )
      .style("color", "#859DE0")
      .text(d => `↓ ${d.edge ? d.edge.quantity : ""}`);
  }
}

export default GraphRender;
