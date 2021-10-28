import noa, { breakBlockAt } from "./index";

export default function initAPI() {
  (window as any).api = new (class API {
    constructor() {}

    breakBlock(x: number, y: number, z: number) {
      breakBlockAt(x, y, z);
    }
    getBlock(x: number, y: number, z: number) {
      return noa.getBlock(x, y, z);
    }
  })();
}
