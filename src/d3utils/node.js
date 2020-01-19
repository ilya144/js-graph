class Node {
  /**
   * Класс узла
   *
   * @property {object} joints Точки соединения узла
   *
   ** if isMegaNode: data = {
   **                         nodeList: Array<Node>,
   **                         countNodes(),
   **                         countLeaf(),
   **                         appendNode()
   **                       }
   */

  static joints = {
    left: { x: 7, y: 32 },
    leftUp: { x: 29, y: 1 },
    leftDown: { x: 29, y: 63 },
    rightUp: { x: 203, y: 1 },
    rightDown: { x: 203, y: 63 },
    right: { x: 225, y: 32 }
  };

  constructor(data, isDuplicate = false, isMegaNode = false) {
    if (data === undefined) {
      throw Error("Node data required");
    }

    Object.entries(data).map(([key, value]) => {
      this[key] = value;
      return this;
    });

    this.lvl = this.level; // real level, which used on rendering
    /**
     * !deprecated
     */
    this.parent = null; // left it for backward compatibility

    this.parents = [];
    this.isDuplicate = isDuplicate;
    this.isMegaNode = isMegaNode;
    this.isHighlighted = false;

    this.joints = {
      left: null,
      leftUp: null,
      leftDown: null,
      rightUp: null,
      rightDown: null,
      right: null
    };
  }

  setHighlighted() {
    this.isHighlighted = true;
    return this;
  }

  unsetHighlighted() {
    this.isHighlighted = false;
    return this;
  }

  /**
   * Method for init joint by data
   * @param {string} jointName
   * @param {Array | Node} node
   */
  setJoint(jointName, node) {
    if (!this.x || !this.y) throw Error("Node.x and Node.y should be defined");

    if (Node.joints[jointName] === undefined)
      throw Error("Wrong name of joint, see Node.joints keys");

    if (node instanceof Array && !(node[0] instanceof Node))
      throw Error(
        "Argument node should be ref to another node or array of nodes"
      );

    this.joints[jointName] = {
      x: this.x + Node.joints[jointName].x,
      y: this.y + Node.joints[jointName].y,
      node
    };
  }

  getJoint(jointName) {
    return this.joints[jointName];
  }

  unsetJoint(joint) {
    if (!this.x || !this.y) throw Error("Node.x and Node.y should be defined");

    if (Node.joints[joint] === undefined)
      throw Error("Wrong name of joint, see Node.joints keys");

    this.joints[joint] = null;
  }

  haveParents() {
    return this.parents.length > 0;
  }

  getParent() {
    if (this.parents.length > 1) throw Error("Node has more than one parent");
    return this.parents[0] instanceof Node ? this.parents[0] : null;
  }

  getFirstParent() {
    return this.parents[0];
  }

  getAllParents() {
    return this.parents;
  }

  addParent(node) {
    if (!(node instanceof Node)) throw Error("Argument node instance of Node");
    this.parents.push(node);
    return this;
  }

  removeParent(node) {
    const index = this.parents.findIndex(parent => parent === node);
    if (index === -1) return this;
    this.parents = [
      ...this.parents.slice(0, index),
      ...this.parents.slice(index + 1)
    ];
    return this;
  }

  flushParents() {
    this.parents = [];
    return this;
  }
}

export default Node;
