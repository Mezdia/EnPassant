import { Emitter } from "rettime";
class NetworkFrame {
  constructor(protocol, data) {
    this.protocol = protocol;
    this.data = data;
    this.events = new Emitter();
  }
  protocol;
  data;
  events;
}
export {
  NetworkFrame
};
//# sourceMappingURL=network-frame.mjs.map