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
    this.edgeMapChilds = edgeReduce(edges, "bid"); // ЭТО ПОЛНЫЙ БРЕД
    this.edgeMapParents = edgeReduce(edges, "sid"); // ЭТО ПОЛНЫЙ БРЕД
  }

  getEdge(pk) {
    return this.edgeMap[pk];
  }

  getEdgeByChild(node_pk) {
    // ЭТО ПОЛНЫЙ БРЕД
    return this.edgeMapChilds[node_pk];
  }

  getEdgeByParent(node_pk) {
    // ЭТО ПОЛНЫЙ БРЕД
    return this.edgeMapParents[node_pk];
  }

  getEdgeByPair(parent_pk, child_pk) {
    return this.edgeList
      .filter(edge => edge.sid === parent_pk)
      .find(edge => edge.bid === child_pk);
  }
}

export default EdgeStore;
