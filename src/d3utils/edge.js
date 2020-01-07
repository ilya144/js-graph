class Edge {
  constructor(data) {
    Object.entries(data).map(([key, value]) => {
      this[key] = value;
      return this;
    });
  }
}

export default Edge;
