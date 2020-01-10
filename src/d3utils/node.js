import { isNull } from "util";

class Node {
  /**
   * Класс узла
   *
   * x, y: координаты узла
   * joints: точки соединения узла
   * balance: остаток на узле
   * isRoot: true - входящие узлы отсутствуют
   * isLeaf: true - исходящие узлы отсутствуют
   * isDulicate: true - узел является дупликатом
   *
   */

  static joints = {
    left: { x: 7, y: 32, node: Node },
    leftUp: { x: 29, y: 1, node: Node },
    leftDown: { x: 29, y: 63, node: Node },
    rightUp: { x: 203, y: 1, node: Node },
    rightDown: { x: 203, y: 63, node: Node },
    right: { x: 225, y: 32, node: Node }
  };

  constructor(data, isDuplicate = false) {
    if (data === undefined) {
      throw Error("Node data required");
    }

    Object.entries(data).map(([key, value]) => {
      this[key] = value;
      return this;
    });

    this.lvl = this.level; // real level, which used on rendering
    this.isDuplicate = isDuplicate;
    this.parent = null;
    this.joints = {
      left: null,
      leftUp: null,
      leftDown: null,
      rightUp: null,
      rightDown: null,
      right: null
    };
  }

  setJoint(joint, node) {
    if (!this.x || !this.y) throw Error("Node.x and Node.y should be defined");

    if (this.constructor.joints[joint] === undefined)
      throw Error("Wrong name of joint, see Node.joints keys");

    this.joints[joint] = {
      x: this.x + this.constructor.joints[joint].x,
      y: this.y + this.constructor.joints[joint].y,
      node
    };
  }

  unsetParent() {
    this.parent = null;
    return this;
  }
}

export default Node;
