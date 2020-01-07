/* global window */
import * as d3 from "d3";
import { Node, NodeStore, GraphRender } from ".";

class Graph extends GraphRender {
  constructor(entryRef, props, data) {
    super();

    const root = d3.select(entryRef);
    const main_svg = this.create_svg(root, entryRef);
    const outer = main_svg.append("g");
    const entry = outer.append("g");

    const zoom_obj = this.create_zoom([0.8, 2.5], [6400, 4096], () => {
      entry.attr("transform", d3.event.transform);
      props.setZoom(d3.event.transform.k);
    });
    window.onresize = this.create_resize_callback(main_svg, entryRef);

    this.main(entry, data);

    outer.call(zoom_obj);
    props.setCallback({
      ...props.useCallback,

      goToStart: () => {
        const transition = entry.transition();
        const duration = 200;
        transition.attr("transform", "translate(0, 0)").duration(duration);
        setTimeout(() => {
          outer.call(zoom_obj.transform, d3.zoomIdentity);
        }, duration);
      },
      setZoom: k => {
        const zoomState = d3.zoomIdentity;
        zoomState.k = k;
        outer.call(zoom_obj.transform, zoomState);
      },
      callResize: this.create_resize_callback(main_svg, entryRef)
    });
  }

  main(entry, data) {
    // eslint-disable-next-line no-console
    console.log(new NodeStore(data.nodes.map(node => new Node(node))));
    this.draw_background(entry, Array(6));
  }

  create_svg(root, entryRef) {
    return root
      .append("svg")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .style("position", "absolute")
      .attr("width", window.innerWidth - entryRef.offsetLeft)
      .attr("height", window.innerHeight - entryRef.offsetTop);
  }

  create_resize_callback(main_svg, entryRef) {
    return () => {
      main_svg
        .attr("width", window.innerWidth - entryRef.offsetLeft)
        .attr("height", window.innerHeight - entryRef.offsetTop);
    };
  }

  create_zoom(scaleExtent, translateExtentMax, callback) {
    return d3
      .zoom()
      .scaleExtent(scaleExtent)
      .translateExtent([[0, 0], translateExtentMax])
      .on("zoom", callback);
  }
}

export default Graph;
