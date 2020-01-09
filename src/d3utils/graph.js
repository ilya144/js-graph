/* global window */
import * as d3 from "d3";
import { Node, NodeStore, Edge, EdgeStore, GraphRender } from ".";
import { runInThisContext } from "vm";

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

    this.main(entry, data, props);

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

  main(entry, data, props) {
    this.draw_background(entry, Array(6), props.isVertical);

    this.nodes = new NodeStore(data.nodes.map(node => new Node(node)));
    this.edges = new EdgeStore(data.edges.map(edge => new Edge(edge)));

    console.log(this.nodes, this.edges);

    this.nodes = new NodeStore(this.create_duplicates());
    this.nodes = new NodeStore(this.add_parents());
    this.fix_levels();
    this.set_lvl_indexes();

    this.draw_by_lvl_index(entry, this.nodes.getAll());
    this.draw_edges_old(entry, this.nodes.getAll());

    console.log(this.nodes);
  }

  create_svg(root, entryRef) {
    return root
      .append("svg")
      .attr("id", "entry")
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

  create_duplicates() {
    if (this.nodes === undefined || this.edges === undefined)
      throw Error("define stores first");

    const nodes = this.nodes.getAll().flatMap(node => {
      const edges_in = node.edges_in
        .replace(/'/g, "")
        .replace("[", "")
        .replace("]", "")
        .split(",");

      if (edges_in.length > 1) {
        return edges_in.map((edge, index) => {
          const new_node = { ...node };
          const isDuplicate = !!index;

          new_node.edges_in = edge;
          if (isDuplicate) {
            new_node.edges_out = "";
            new_node.leaf = false;
          }
          return new Node(new_node, isDuplicate);
        });
      }
      return node;
    });

    return nodes;
  }

  add_parents() {
    if (this.nodes === undefined || this.edges === undefined)
      throw Error("define stores first");

    const nodes = this.nodes.getAll().map(node => {
      if (node.edges_in !== "") {
        node.parent = this.nodes.getNode(this.edges.getEdge(node.edges_in).sid);
      }
      return node;
    });

    return nodes;
  }

  // Attention: this func has side effects - she change nodes in this.store
  fix_levels() {
    if (this.nodes === undefined || this.edges === undefined)
      throw Error("define stores first");

    const nodes = this.nodes.getAll();

    // fix root level - just 0 + 1
    const root = nodes.filter(node => node.level === 0)[0];
    root.lvl = root.level + 1;

    // fix dupes
    nodes
      .filter(node => node.isDuplicate)
      .map(node => {
        const parent = this.nodes.getNode(node.parent);
        if (parent && node.lvl - parent.lvl > 1) {
          node.lvl = parent.lvl + 1;
        }
        return node;
      });

    // fix technical nodes of parent-leaf
    nodes
      .filter(node => node.status === 2)
      .map(node => {
        const edge = this.edges.getEdgeByChild(node.pk);
        const parent = this.nodes.getNode(edge && edge.sid);
        if (parent && parent.leaf) {
          node.lvl = parent.lvl;
        }
        return node;
      });
    return nodes;
  }

  set_lvl_indexes() {
    if (this.nodes === undefined || this.edges === undefined)
      throw Error("define stores first");

    const nodes = this.nodes.getAll();
    const nodesByLvls = [];
    nodes.map(node => {
      if (nodesByLvls[node.lvl] === undefined) {
        nodesByLvls[node.lvl] = [];
      }
      nodesByLvls[node.lvl].push(node);
      return node;
    });

    nodesByLvls.map(array =>
      array.map((node, index) => {
        node.lvlIndex = index;
        return node;
      })
    );
  }

  sortByLvlIndex() {}

  define_coords() {}
}

export default Graph;
