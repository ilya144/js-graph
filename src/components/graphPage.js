/* global window */
import React, { useRef, useEffect } from "react";
import { Box } from "@material-ui/core";
import * as d3 from "d3";
import edges from "../d3utils/edges";

console.log(edges.types["1"]);

const treeRoot = {
  name: "root",
  children: [
    { name: "first" },
    { name: "second", children: [] },
    {
      name: "third",
      children: [{ name: "last" }, { name: "last2" }, { name: "last3" }]
    }
  ]
};

const GraphPage = ({ useCallback, setCallback, ...props }) => {
  const graphRef = useRef(null);

  useEffect(() => {
    const data = Array(6).fill(0);

    if (graphRef) {
      const root = d3.select(graphRef.current);
      root.style("background", "#fff");

      const main_svg = root
        .append("svg")
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .style("position", "absolute")
        .attr("class", "graph-entry")
        .attr("width", window.innerWidth - graphRef.current.offsetLeft)
        .attr("height", window.innerHeight - graphRef.current.offsetTop)
        .attr(
          "viewport",
          `0 0 ${graphRef.current.offsetWidth} ${graphRef.current.offsetHeight}`
        );

      const resize_callback = () => {
        main_svg
          .attr("width", window.innerWidth - graphRef.current.offsetLeft)
          .attr("height", window.innerHeight - graphRef.current.offsetTop);
      };
      window.onresize = resize_callback;

      const outer = main_svg.append("g");
      const entry = outer.append("g");

      entry
        .append("foreignObject")
        // .attr("width", window.innerWidth - graphRef.current.offsetLeft)
        .attr("width", 320 * 6)
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
        .style("background", (d, i) => {
          if (i % 2 === 0) {
            return "#1c2436";
          } else {
            return "#181E2F";
          }
        })
        .append("xhtml:p")
        .text((d, i) => ++i)
        .attr(
          "style",
          `
            position: relative;
            width: 40px;
            height: 84px;
            left: 16px;
            top: 0px;

            font-family: Roboto;
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

      const hroot = d3.hierarchy(treeRoot);
      hroot.descendants().map((d, i) => {
        d.yIn = 320 * d.depth + 50 + 7;
        d.xIn = 160 + 65 * i - 100 * d.depth + 32;
        d.yOut = 320 * d.depth + 50 + 205;
        d.xOut = 160 + 65 * i - 100 * d.depth + 32;
      });

      const g = entry
        .selectAll("empty")
        .data(hroot.descendants())
        .join("g")
        .attr("transform", (d, i) => {
          const x = 320 * d.depth + 50;
          const y = 160 + 65 * i - 100 * d.depth;
          return `translate(${x}, ${y})`;
        })
        .attr("fill", "none")
        .attr("width", "212")
        .attr("height", "64")
        .attr("viewBox", "0 0 212 64");

      g.append("rect")
        .attr("x", "7")
        .attr("y", "1")
        .attr("width", "198")
        .attr("height", "62")
        .attr("rx", d => (d.depth === 0 ? "16" : "32"))
        .attr("stroke", "#5A6487")
        .attr("stroke-width", "2");

      g.filter((d, i) => (d.height === 0 ? false : true))
        .append("circle")
        .attr("cx", "205")
        .attr("cy", "32")
        .attr("r", "5.5")
        .attr("fill", "#5A6487")
        .attr("stroke", "#181E2F")
        .attr("stroke-width", "3");

      g.filter((d, i) => (d.depth === 0 ? false : true))
        .append("circle")
        .attr("cx", "7")
        .attr("cy", "32")
        .attr("r", "5.5")
        .attr("fill", "#5A6487")
        .attr("stroke", "#181E2F")
        .attr("stroke-width", "3");

      const fObj = g
        .append("foreignObject")
        // .attr("x", "68")
        .attr("x", "78")
        .attr("y", "14")
        .attr("width", "100")
        .attr("height", "200");
      const fObj2 = g
        .append("foreignObject")
        .attr("x", "10")
        .attr("y", "24")
        .attr("width", "60")
        .attr("height", "200");
      fObj
        .append("xhtml:p")
        .attr("xmlns", "http://www.w3.org/1999/xhtml")
        .style("color", "white")
        .text(d =>
          d.depth === 0
            ? "root node there"
            : d.height === 0
            ? "this is leaf node"
            : "this is branch node"
        );
      fObj2
        .append("xhtml:p")
        .attr("xmlns", "http://www.w3.org/1999/xhtml")
        .style("color", "white")
        .text(d => d.data.name);

      const links = entry
        .append("g")
        .attr("fill", "none")
        .attr("stroke", "#fff")
        // .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 2)
        .selectAll("path")
        .data(
          hroot.links().map(e => {
            e.source.x = e.source.xOut;
            e.source.y = e.source.yOut;
            e.target.x = e.target.xIn;
            e.target.y = e.target.yIn;
            return e;
          })
        )
        .join("g"); //.join("path")
      links
        .append("path")
        .attr("stroke", "#5A6487")
        .attr("d", (d, i) => {
          const c = d3.path();
          const s = d.source;
          const t = d.target;

          // c.fillStyle = "#5A6487";
          c.moveTo(s.yOut + 5, s.xOut);
          c.lineTo(s.yOut + 20, s.xOut);

          const sign = t.xIn < s.xOut ? 1 : -1;
          c.lineTo(s.yOut + 20, t.xIn + 15 * sign);
          if (i !== 1)
            c.bezierCurveTo(
              s.yOut + 20,
              t.xIn + 15 * sign,
              s.yOut + 20,
              t.xIn,
              s.yOut + 20 + 15,
              t.xIn
            );
          if (i !== 1) c.lineTo(t.yIn - 5, t.xIn);
          return c;
        });
      links
        .append("path")
        .attr("stroke", "#859DE0")
        // .attr("transform", "matrix(1, 0, 0, -1, 0, 0)")
        .attr("stroke-dasharray", "6 3 2 3")
        .attr("d", (d, i) => {
          const c = d3.path();
          const s = d.source;
          const t = d.target;

          if (i !== 1) return;
          const sign = t.xIn < s.xOut ? 1 : -1;
          c.moveTo(s.yOut + 20, t.xIn + 15 * sign);
          c.bezierCurveTo(
            s.yOut + 20,
            t.xIn + 15 * sign,
            s.yOut + 20,
            t.xIn,
            s.yOut + 20 + 15,
            t.xIn
          );
          c.moveTo(s.yOut + 20 + 15, t.xIn);
          c.lineTo(t.yIn - 5, t.xIn);
          return c;
        });

      const zoom = () => {
        // console.log(d3.event.transform);
        // g.attr("transform", d3.event.transform);
        // const maxScroll = 1000;//.property("scrollLeft", maxScroll * (1 - d3.event.transform.k));
        // entry.selectAll().translate(10, 0);
        // entry.attr(
        //   "transform",
        //   "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")"
        // );
        entry.attr("transform", d3.event.transform);
        props.setZoom(d3.event.transform.k);
        // console.log(d3.event);
      };

      outer.call(
        d3
          .zoom()
          .scaleExtent([0.8, 2.5]) // was [0.5, 5]
          .translateExtent([
            [0, 0],
            [1920, 1080]
          ])
          .on("zoom", zoom)
      );
      // .on("wheel.zoom", null);
      setCallback({
        goToStart: () => {
          const transition = entry.transition();
          transition
            .attr("transform", "translate(0, 0)")
            .duration(200)
            .call(zoom.transform, d3.zoomIdentity);
        },
        callResize: resize_callback,
        ...useCallback
      });
      // console.log(graphRef.current);
      // console.log(d3.hierarchy(treeRoot));
      // console.log(hroot.descendants());
    }
  }, [graphRef]); //graphRef.current.offsetWidth

  return (
    <Box
      className="entry-div"
      ref={graphRef}
      style={{
        width: "100%",
        height: "100%",
        background: "#1c2436", //"#5A6487",
        overflow: "hidden",

        display: "flex",
        flexDirection: "row"
      }}
      onWheel={e => {
        graphRef.current.scrollBy(e.deltaX, 0);
      }}
    >
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        class="graph-entry"
        // width="100%"
        height="100vh"
        style={{ position: "absolute" }}
      >
        <g />
      </svg> */}
      {/* <svg
        width="212"
        height="64"
        viewBox="0 0 212 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="7"
          y="1"
          width="198"
          height="62"
          rx="31"
          stroke="#5A6487"
          stroke-width="2"
        />
        <foreignObject x="68" y="14" width="100" height="200">
          <p style={{ color: "white" }} xmlns="http://www.w3.org/1999/xhtml">
            Text goes here
          </p>
        </foreignObject>
        <circle
          cx="205"
          cy="32"
          r="5.5"
          fill="#5A6487"
          stroke="#181E2F"
          stroke-width="3"
        />
        <circle
          cx="7"
          cy="32"
          r="5.5"
          fill="#5A6487"
          stroke="#181E2F"
          stroke-width="3"
        />
      </svg> */}
    </Box>
  );
};

export default GraphPage;
