import Node from "../node";

class NodeStore {
  constructor(nodes) {
    if (nodes[0] === undefined) {
      throw Error("Array of nodes required");
    }

    if (!(nodes[0] instanceof Node)) {
      throw Error("Argument array should contain Node objects");
    }

    this.nodeList = nodes;
    this.nodeMap = nodes
      .filter(node => !node.isDuplicate)
      .reduce((state, node) => Object.assign(state, { [node.pk]: node }), {});
  }

  getNode(pk) {
    return this.nodeMap[pk];
  }

  getAll() {
    return this.nodeList;
  }

  removeNode(nodeToRemove) {
    this.nodeList.pop(this.nodeList.findIndex(node => node === nodeToRemove));
    this.nodeMap = this.nodeList
      .filter(node => !node.isDuplicate)
      .reduce((state, node) => Object.assign(state, { [node.pk]: node }), {});
  }
}

export default NodeStore;
