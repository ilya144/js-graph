class Node {
  /**
   * Класс узла
   *
   * coords: координаты узла
   * joints: точки соединения узла
   * balance: остаток на узле
   * isRoot: true - входящие узлы отсутствуют
   * isLeaf: true - исходящие узлы отсутствуют
   * isDulicate: true - узел является дупликатом
   *
   */

  static coords = { x: Number, y: Number };
  static joints = {
    left: { x: Number, y: Number },
    leftUp: { x: Number, y: Number },
    leftDown: { x: Number, y: Number },
    rightUp: { x: Number, y: Number },
    rightDown: { x: Number, y: Number },
    right: { x: Number, y: Number }
  };

  static isDulicate = Boolean;

  constructor(data, isDuplicate = false) {
    if (data === undefined) {
      throw Error("Node data required");
    }
    
    Object.entries(data).map(([key, value]) => {
      this[key] = value;
      return this;
    });

    this.isDuplicate = isDuplicate;
  }

  setJoints() {}
}

export default Node;
