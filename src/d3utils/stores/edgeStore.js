class EdgeStore {
  constructor(edges) {
    const edgeReduce = (list, key = "pk") => {
      return list.reduce(
        (state, edge) => Object.assign(state, { [edge[key]]: edge }),
        {}
      );
    };

    this.edgeList = edges;
    this.edgeMap = edgeReduce(edges, "pk");
    this.edgeMapChilds = edgeReduce(edges, "bid");
    this.edgeMapParents = edgeReduce(edges, "sid");
  }

  getEdge(pk) {
    return this.edgeMap[pk];
  }

  getEdgeByChild(node_pk) {
    return this.edgeMapChilds[node_pk];
  }

  getEdgeByParent(node_pk) {
    return this.edgeMapParents[node_pk];
  }

  getAllEdgesByChild(node_pk) {
    return this.edgeList.filter(edge => edge.bid === node_pk);
  }

  getAllEdgesByParent(node_pk) {
    return this.edgeList.filter(edge => edge.sid === node_pk);
  }

  getEdgeByPair(parent_pk, child_pk) {
    return this.edgeList
      .filter(edge => edge.sid === parent_pk)
      .find(edge => edge.bid === child_pk);
  }
}

export default EdgeStore;
