/* global window */
import * as d3 from "d3";
import { isNullOrUndefined } from "util";
import { Node, NodeStore, Edge, EdgeStore, GraphRender } from ".";

class Graph extends GraphRender {
  constructor(entryRef, props, data) {
    super();

    Array.prototype.move = function(from, to) {
      this.splice(to, 0, this.splice(from, 1)[0]);
      return this;
    };
    Array.prototype.emptyToZero = function() {
      return Array.from(this, item => item || 0);
    };
    Array.prototype.getLast = function() {
      return this[this.length - 1];
    };
    Array.prototype.remove = function(index) {
      if (!isNullOrUndefined(index) && index < this.length && index >= 0) {
        this.move(index, this.length - 1);
        this.pop();
      }
      return this;
    };

    const root = d3.select(entryRef);
    const main_svg = this.create_svg(root, entryRef);
    const outer = main_svg.append("g");
    const entry = outer.append("g");
    const zoom_obj = this.create_zoom([0.8, 2.5], [6400, 4096], () => {
      entry.attr("transform", d3.event.transform);

      const dx = (d3.event.transform.x / d3.event.transform.k / 1920) * 268;
      const dy = (d3.event.transform.y / d3.event.transform.k / 1080) * 130;

      const mapWidth = parseFloat(entry.node().getBoundingClientRect().width);
      const mapHeight = parseFloat(entry.node().getBoundingClientRect().height);
      const factor = mapWidth * 0.008;

      d3.select(".minimap > svg > rect")
        .attr("width", mapWidth / factor / d3.event.transform.k)
        .attr("height", mapHeight / factor / d3.event.transform.k)
        .attr("transform", `translate(${-dx},${-dy})`);
      outer.node().__zoom = d3.event.transform;
      d3.select(".minimap svg").node().__zoom = d3.event.transform;

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
      setZoom: k => outer.call(zoom_obj.scaleTo, k),
      callResize: this.create_resize_callback(main_svg, entryRef),
      callMain: () => this.main(entry, data, props)
    });
    d3.select(".minimap")
      .append("svg")
      .attr("width", "248")
      .attr("height", "130");

    document
      .querySelector(".minimap svg")
      .appendChild(entry.node().cloneNode(true));

    // Убираю нумерованную подложку
    d3.select(".minimap svg g foreignObject").remove();

    // Уменьшаем пропорционально
    d3.select(".minimap svg g").attr("transform", "scale(0.15)");

    // Создаем квадрат позиционирования
    d3.select(".minimap")
      .select("svg")
      .append("rect")
      .attr("width", "40")
      .attr("height", "40")
      .attr("fill", "white")
      .style("border", "2px solid red")
      .attr("fill-opacity", "0.05");

    // Подключаем обработчик изменений масштаба и положения
    outer.call(zoom_obj.transform, d3.zoomIdentity);
    d3.select(".minimap svg").call(zoom_obj);
  }

  main(entry, data, props) {
    entry.selectAll("*").remove();
    props.setHeaderText("Общий режим");
    this.nodes = new NodeStore(data.nodes.map(node => new Node(node)));
    this.edges = new EdgeStore(data.edges.map(edge => new Edge(edge)));

    this.nodes = new NodeStore(this.create_duplicates());

    this.add_parents();
    this.fix_levels();
    this.set_lvl_indexes();

    this.sort_by_lvl_index();
    this.optimize_duplicates();

    this.define_coords();
    this.define_joints();
    this.all_nodes = this.nodes.getAll();

    //* Здесь я могу переделать граф под режим выделенного узла
    const draw_highlighted = (lvl, index) => {
      d3.select("g.nodes").remove();
      d3.select("g.edges").remove();
      this.make_mega_nodes(
        this.all_nodes.find(node => node.lvl === lvl && node.lvlIndex === index)
      );
      // this.set_lvl_indexes();
      // this.sort_by_lvl_index();
      // this.define_coords();
      // this.define_joints();
      this.nodes.getAll().map(node => node.fixJointParents("left"));

      this.draw_nodes_by_coords(entry, this.nodes.getAll());
      this.draw_edges_by_joints(entry, this.make_paths());
      this.draw_meganodes(entry, this.nodes.getAll());
      props.setHeaderText("Окружение НП по выбранному...");
    };

    this.draw_background(entry, Array(6), props.isVertical);
    this.draw_nodes_by_coords(entry, this.nodes.getAll(), draw_highlighted);
    this.draw_edges_by_joints(entry, this.make_paths());
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

  // Создаю каждому узлу с несколькими родителями по дубликату на родителя
  create_duplicates() {
    if (this.nodes === undefined || this.edges === undefined)
      throw Error("define stores first");

    const nodes = this.nodes.getAll().flatMap(node => {
      const edges_in_list = node.edges_in
        .replace(/'/g, "")
        .replace("[", "")
        .replace("]", "")
        .split(",");

      if (edges_in_list.length > 1) {
        return edges_in_list.map((edge, index) => {
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
        const nodeParent = this.nodes.getNode(
          this.edges.getEdge(node.edges_in).sid
        );
        nodeParent && node.addParent(nodeParent);
      }
      if (node.edges_in === "" && !node.isDuplicate) {
        const nodeParent = this.nodes.getNode(
          this.edges.getEdgeByChild(node.pk) &&
            this.edges.getEdgeByChild(node.pk).sid
        );
        nodeParent && node.addParent(nodeParent);
      }
      return node;
    });

    return nodes;
  }

  // Attention: this func has side effects - it changes nodes in this.store
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
        const parent = node.getParent();
        if (parent && node.lvl - parent.lvl > 1) {
          node.lvl = parent.lvl + 1;
        }
        return node;
      });

    // fix technical nodes of parent-leaf if node.type == 07 or 19
    nodes
      .filter(node => node.status === 2)
      .map(node => {
        const edge = this.edges.getEdgeByChild(node.pk);
        const parent = this.nodes.getNode(edge && edge.sid);
        if (parent && parent.leaf && (node.type === 7 || node.type === 19)) {
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

  sort_by_lvl_index() {
    if (this.nodes === undefined || this.edges === undefined)
      throw Error("define stores first");

    const nodes = this.nodes.getAll();
    const maxLvl = this.getLastLvl(nodes);
    const minLvl = 1;

    const nodesByLvls = [];
    nodes.map(node => {
      if (nodesByLvls[node.lvl] === undefined) {
        nodesByLvls[node.lvl] = [];
      }
      nodesByLvls[node.lvl].push(node);
      return node;
    });

    // cluster sorting by node.parent.lvlIndex
    for (let i = maxLvl; i >= minLvl; i--) {
      for (let j = i; j <= maxLvl; j++) {
        const sorted = nodesByLvls[j].sort((a, b) => {
          const x = a.getParent() ? a.getParent().lvlIndex : 777;
          const y = b.getParent() ? b.getParent().lvlIndex : 777;

          return x - y;
        });
        sorted.map((node, index) => {
          node.lvlIndex = index;
          return node;
        });
      }
    }

    // sort root
    nodesByLvls[1]
      .move(
        nodesByLvls[1].findIndex(node => node.level === 0),
        0
      )
      .map((node, index) => {
        node.lvlIndex = index;
        return node;
      });

    // sort bottom childs - technical nodes
    nodesByLvls
      .filter((_, index) => index > 1 && index <= maxLvl)
      .map(array => {
        array
          .filter(node => node.status === 2 && !node.getParent())
          .map(node => {
            const topParent = this.nodes.getNode(
              this.edges.getEdgeByChild(node.pk) &&
                this.edges.getEdgeByChild(node.pk).sid
            );

            if (topParent)
              array.move(
                node.lvlIndex,
                array.findIndex(
                  node_parent => node_parent.pk === topParent.pk
                ) + 1
              );

            array.map((lvl_node, index) => {
              lvl_node.lvlIndex = index;
            });

            return node;
          });

        return array;
      });

    return nodes;
  }

  // inner function in define_coords
  set_nodes_coords(nodes, i) {
    const max_nodes_lvl = this.getMaxLengthLvl(nodes);

    nodes
      .filter(node => node.lvl === i)
      .sort(this.sortByField("lvlIndex"))
      .map((node, index, array) => {
        node.x = 320 * (node.lvl - 1) + 50;
        if (i < max_nodes_lvl)
          node.y = nodes
            .filter(innerNode => innerNode.getFirstParent() === node)
            .reduce(...this.getCoordReducer())
            .average();

        if (i > max_nodes_lvl)
          node.y = node.getFirstParent() && node.getFirstParent().y;

        if (index === 0) {
          if (isNaN(node.y)) node.y = 86 + node.lvlIndex * 80;
        } else {
          if (isNaN(node.y)) node.y = 86 + node.lvlIndex * 80;

          const diff = node.y - array[index - 1].y;
          if (diff < 80) node.y += 80 - diff;
        }

        return [node.x, node.y];
      });
  }

  define_coords() {
    if (this.nodes === undefined || this.edges === undefined)
      throw Error("define stores first");

    const nodes = this.nodes.getAll();
    const last_lvl = this.getLastLvl(nodes);
    const max_length_lvl = this.getMaxLengthLvl(nodes);

    nodes
      .filter(node => node.lvl === max_length_lvl)
      .map(node => {
        node.x = 320 * (node.lvl - 1) + 50;
        node.y = 86 + node.lvlIndex * 80;

        return node;
      });

    if (last_lvl === max_length_lvl) {
      for (let i = last_lvl - 1; i >= 1; i--) {
        this.set_nodes_coords(nodes, i);
      }
    } else {
      // to right
      for (let i = max_length_lvl + 1; i <= last_lvl; i++) {
        this.set_nodes_coords(nodes, i);
      }
      // to left
      for (let i = max_length_lvl - 1; i >= 1; i--) {
        this.set_nodes_coords(nodes, i);
      }
    }
    nodes.find(node => node.level === 0).y = 86;
  }

  define_joints() {
    if (this.nodes === undefined || this.edges === undefined)
      throw Error("define stores first");

    const nodes = this.nodes.getAll();

    // define joints parent (lvl n) - child (lvl n + 1)
    nodes
      .filter(node => node.haveParents())
      .map(node => {
        const parents = node.getAllParents().filter(n => nodes.includes(n));
        node.setJoint("left", parents);
        parents.map(parent => parent.setJoint("right", node));
        return node;
      });

    // define joints root - second node below him
    const root = nodes.find(node => node.level === 0);
    const rootChild = nodes.find(node => node.getFirstParent() === root);

    root.setJoint("leftDown", rootChild);
    rootChild.setJoint("leftUp", root);

    // define joints node - tech node below him
    nodes
      .filter(node => node.status === 2 && !node.getFirstParent())
      .map(node => {
        const topParent = this.nodes.getNode(
          this.edges.getEdgeByChild(node.pk) &&
            this.edges.getEdgeByChild(node.pk).sid
        );

        if (topParent /*  && topParent.lvl === node.lvl */) {
          node.setJoint("rightUp", topParent);
          topParent.setJoint("rightDown", node);
        }

        return node;
      });
    root.unsetJoint("right");
    rootChild.unsetJoint("left");
  }

  make_paths() {
    if (this.nodes === undefined || this.edges === undefined)
      throw Error("define stores first");

    const nodes = this.nodes.getAll();
    const paths = [];

    // left upside-down
    const root = nodes.find(node => node.level === 0);

    root &&
      paths.push({
        source: { x: root.joints.leftDown.x, y: root.joints.leftDown.y },
        target: {
          x: root.joints.leftDown.node.joints.leftUp.x,
          y: root.joints.leftDown.node.joints.leftUp.y
        },
        type: "vertical",
        edge: this.edges.getEdgeByPair(root.pk, root.joints.leftDown.node.pk)
      });

    // from child to parent

    nodes
      .filter(node => node.haveParents() && node.lvl > 1)
      .map(node => {
        const joinedNodes = node.getJoint("left").node;
        if (joinedNodes instanceof Array) {
          joinedNodes.map(nodeParent => {
            Node = node;
            if (node.isMegaNode) Node = node.nodeList[0];

            paths.push({
              source: {
                x: nodeParent.joints.right.x,
                y: nodeParent.joints.right.y
              },
              target: {
                x: node.joints.left.x,
                y: node.joints.left.y
              },
              type: "horizontal",
              edge: this.edges.getEdgeByPair(nodeParent.pk, Node.pk)
            });
          });
          return null;
        }
        paths.push({
          source: {
            x: node.getParent().joints.right.x,
            y: node.getParent().joints.right.y
          },
          target: {
            x: node.joints.left.x,
            y: node.joints.left.y
          },
          type: "horizontal",
          edge: this.edges.getEdgeByPair(node.getParent().pk, node.pk)
        });
        return null;
      });

    // right upside-down
    nodes
      .filter(node => node.status === 2 && !node.getParent())
      .map(node => {
        // TODO УБРАТЬ getEdgeByChild
        const topParent = this.nodes.getNode(
          this.edges.getEdgeByChild(node.pk) &&
            this.edges.getEdgeByChild(node.pk).sid
        );

        if (topParent && topParent.lvl === node.lvl) {
          paths.push({
            source: {
              x: topParent.joints.rightDown.x,
              y: topParent.joints.rightDown.y
            },
            target: {
              x: node.joints.rightUp.x,
              y: node.joints.rightUp.y
            },
            type: "vertical",
            edge: this.edges.getEdgeByPair(topParent.pk, node.pk)
          });
        }

        return node;
      });
    return paths;
  }

  make_mega_nodes(highlitedNode) {
    if (this.nodes === undefined || this.edges === undefined)
      throw Error("define stores first");

    if (!(highlitedNode instanceof Node))
      throw Error("Argument highlitedNode must be instance of Node class");

    const createMegaNode = (nodes = [], level, parent) => {
      if (isNullOrUndefined(nodes) || isNullOrUndefined(nodes.length)) {
        throw Error("Argument nodes should be an Array of nodes");
      }
      return new Node(
        {
          nodeList: nodes,
          countNodes() {
            return this.nodeList.length;
          },
          countLeaf() {
            return this.nodeList.filter(node => node.leaf).length;
          },
          appendNode(node) {
            if (!(node instanceof Node))
              throw Error("Argument node must be instance of Node class");
            this.nodeList.push(node);
            return this;
          },
          level
        },
        false,
        true
      ).addParent(parent);
    };

    const nodes = this.nodes.getAll();

    nodes.map(node => node instanceof Node && node.unsetHighlighted());
    highlitedNode.setHighlighted();

    // Обратный обход дерева узлов,
    function getAncestors(node) {
      const state = { all: [], current: [node] };
      for (;;) {
        if (!state.current.some(n => n.haveParents())) break;

        state.all.push(...state.current.flatMap(n => n.getAllParents()));
        state.current = state.current.flatMap(n => n.getAllParents());
      }
      return state.all;
    }
    function getDescendants(parentNode) {
      const state = { all: [], current: [parentNode] };
      for (;;) {
        const childrenNextLvl = state.current.flatMap(node =>
          nodes
            .filter(n => n.lvl === node.lvl + 1)
            .filter(n => n.getAllParents().includes(node))
        );

        if (childrenNextLvl.length === 0) break;

        state.all.push(...childrenNextLvl);
        state.current = childrenNextLvl;
      }
      return state.all;
    }

    // Массив предков выделенного узла
    const ancestorsArray = Array.from(new Set(getAncestors(highlitedNode)));

    // Массив детей расстоянии одного ребра от выбранного узла
    const highlitedChildren = nodes.filter(node =>
      node.getAllParents().includes(highlitedNode)
    );

    // Массив узлов, НЕ являющиеся частью мегаузлов
    const noMegaArray = [
      ...ancestorsArray,
      highlitedNode,
      ...highlitedChildren
    ];
    noMegaArray.map(node => {
      const parents = node.getAllParents().filter(n => noMegaArray.includes(n));
      node.flushParents();
      parents.map(n => node.addParent(n));
    });

    // Массив мегаузлов
    const megaNodes = [];

    // Обход дерева от корня до выделленого с созданием мегаузлов
    const ancestorsByLvl = [];
    ancestorsArray.map(node => {
      if (ancestorsByLvl[node.lvl] === undefined) {
        ancestorsByLvl[node.lvl] = [];
      }
      ancestorsByLvl[node.lvl].push(node);
      return node;
    });

    ancestorsByLvl.map((array, index) => {
      //* Обходим дерево предков послойно и по каждому предку
      array.map(parentNode => {
        //* Получаем список узлов, которые могу образовать мегаузел
        const a = nodes
          .filter(
            node =>
              node !== highlitedNode &&
              node.lvl === index + 1 &&
              node.getAllParents().includes(parentNode)
          )
          .filter(
            node =>
              !(
                ancestorsByLvl[index + 1] instanceof Array &&
                ancestorsByLvl[index + 1].includes(node)
              )
          );

        a.map(node => {
          //* Тута делаем мегаузел
          const mega = createMegaNode(
            [node],
            node.lvl,
            node.haveParents() ? parentNode : null
          );
          mega.x = node.x;
          mega.y = node.y;
          if (mega.haveParents()) {
            mega.setJoint("left", parentNode);
            parentNode.setJoint("right", mega);
          }
          getDescendants(node).map(n => mega.appendNode(n));

          megaNodes.push(mega);
        });
      });
    });

    // Создаем мегаузлы из внуков выделенного узла
    noMegaArray
      .filter(node => node.getAllParents().includes(highlitedNode))
      .filter(node => nodes.filter(n => n.getAllParents().includes(node)))
      .map(parentNode => {
        nodes
          .filter(node => node.getAllParents().includes(parentNode))
          .map(node => {
            //* Правка: из технических узлов мегаузлы не делать
            if (node.status === 2) {
              megaNodes.push(node);
              return;
            }

            const mega = createMegaNode(
              [node],
              node.lvl,
              node.haveParents() ? parentNode : null
            );
            mega.x = node.x;
            mega.y = node.y;
            if (mega.haveParents()) {
              mega.setJoint("left", parentNode);
              parentNode.setJoint("right", mega);
            }
            getDescendants(node).map(n => mega.appendNode(n));

            megaNodes.push(mega);
          });
      });

    // Создаем новое хранилище узлов, в соотвествии с выбранным
    this.nodes = new NodeStore([...noMegaArray, ...megaNodes]);
  }

  // Функция оптимизации количества дупликатов на одном уровне
  optimize_duplicates() {
    if (this.nodes === undefined || this.edges === undefined)
      throw Error("define stores first");

    if (isNullOrUndefined(this.nodes.getAll()[0].lvlIndex))
      throw Error("define lvl indexes first");

    const nodes = this.nodes.getAll().filter(node => !node.isMegaNode);
    const last_lvl = this.getLastLvl(nodes);

    for (let i = last_lvl; i > 1; i--) {
      const nodesOnLvl = nodes.filter(node => node.lvl === i);
      const optimizedMap = {};
      const notOptimizedMap = nodesOnLvl
        .reduce(
          (map, node) => {
            if (map[node.pk] === undefined) {
              map[node.pk] = [];
            }
            map[node.pk].push(node);
            return map;
          },
          {
            removeSingle() {
              Object.keys(this).map(key =>
                this[key].length === 1 ? delete this[key] : null
              );
              delete this.removeSingle;
              return this;
            }
          }
        )
        .removeSingle();

      //* Оптимизация дубликатов по группам
      Object.values(notOptimizedMap).map(array => {
        const main = array.find(node => !node.isDuplicate);
        const dups = array.filter(node => node.isDuplicate);

        dups.map(dupl => {
          // Если дуликат и оригинал соседи - оптимизировать нечего
          if (Math.abs(main.lvlIndex - dupl.lvlIndex) === 1) {
            main.addParent(dupl.getParent());
            this.nodes.nodeList.remove(
              this.nodes.nodeList.findIndex(n => n === dupl)
            );
            return;
          }

          // Если родители соседи - возможно перемещать придеться только деток (дупликаты)
          const parentIndexDiff =
            main.getParent().lvlIndex - dupl.getParent().lvlIndex;
          const main_sibs = nodes
            .filter(node =>
              node.getAllParents().some(n => main.getAllParents().includes(n))
            )
            .sort(this.sortByField("lvlIndex"));
          const dupl_sibs = nodes
            .filter(node =>
              node.getAllParents().some(n => dupl.getAllParents().includes(n))
            )
            .sort(this.sortByField("lvlIndex"));

          if (Math.abs(parentIndexDiff) === 1) {
            if (parentIndexDiff > 0) {
              // родитель главного снизу
              if (main_sibs[0] !== main) this.swapNodes(main, main_sibs[0]);
              if (dupl_sibs.getLast() !== dupl)
                this.swapNodes(dupl, dupl_sibs.getLast());
            } else {
              // родитель главного сверху
              if (main_sibs.getLast() !== main)
                this.swapNodes(main, main_sibs.getLast());
              if (dupl_sibs[0] !== dupl) this.swapNodes(dupl, dupl_sibs[0]);
            }
          } else {
            if (parentIndexDiff > 0) {
              // родитель главного снизу
              if (main_sibs.getLast() !== main)
                this.swapNodes(main, main_sibs.getLast());
              if (dupl_sibs[0] !== dupl) this.swapNodes(dupl, dupl_sibs[0]);

              this.moveNode(dupl, main.lvlIndex);
              this.moveNode(dupl.getParent(), main.getParent().lvlIndex);
            } else {
              // родитель главного сверху
              if (main_sibs[0] !== main) this.swapNodes(main, main_sibs[0]);
              if (dupl_sibs.getLast() !== dupl)
                this.swapNodes(dupl, dupl_sibs.getLast());

              this.moveNode(dupl, main.lvlIndex);
              this.moveNode(dupl.getParent(), main.getParent().lvlIndex);
            }
          }

          main.addParent(dupl.getParent());
          this.nodes.nodeList.remove(
            this.nodes.nodeList.findIndex(n => n === dupl)
          );
        });

        optimizedMap[main.pk] = notOptimizedMap[main.pk];
        delete notOptimizedMap[main.pk];
      });
    }
  }

  getLastLvl(nodes) {
    if (!(nodes[0] instanceof Node))
      throw Error("Argument nodes should be array of Node objects");

    return nodes.reduce((last_lvl, elem) => {
      if (elem.lvl > last_lvl) return elem.lvl;
      return last_lvl;
    }, 0);
  }

  // get lvl with maximum of nodes
  getMaxLengthLvl(nodes) {
    if (!(nodes[0] instanceof Node))
      throw Error("Argument nodes should be array of Node objects");

    return nodes
      .reduce((acc, node) => {
        if (acc[node.lvl]) acc[node.lvl] += 1;
        else acc[node.lvl] = 1;

        return acc;
      }, [])
      .emptyToZero()
      .reduce(
        (max_index, value, index, array) =>
          value > array[max_index] ? index : max_index,
        0
      );
  }

  sortByField(str) {
    return (a, b) => (a[str] > b[str] ? 1 : -1);
  }

  getCoordReducer() {
    return [
      (obj, node) => {
        obj.sum += node.y;
        obj.count++;
        return obj;
      },
      {
        sum: 0,
        count: 0,
        average() {
          return this.sum / this.count;
        }
      }
    ];
  }

  swapNodes(node1, node2) {
    if (!(node1 instanceof Node) || !(node2 instanceof Node))
      throw Error("Arguments should be instances of Node");

    if (node1.lvl !== node2.lvl)
      throw Error("Nodes should have same real levels");

    if (node1.parents.length > 1 || node2.parents.length > 1)
      throw Error("You cant swap nodes with multiple parents");

    const swap = node1.lvlIndex;
    node1.lvlIndex = node2.lvlIndex;
    node2.lvlIndex = swap;
  }

  moveNode(node, toIndex) {
    if (!(node instanceof Node))
      throw Error("Argument should be instance of Node");

    if (isNullOrUndefined(node.lvlIndex)) throw Error("Define lvl index first");

    const nodes = this.nodes.getAll().filter(n => n.lvl === node.lvl);
    nodes
      .sort(this.sortByField("lvlIndex"))
      .move(node.lvlIndex, toIndex)
      .map((n, index) => {
        n.lvlIndex = index;
      });
  }
}

export default Graph;
