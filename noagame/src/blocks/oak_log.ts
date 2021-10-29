import { Block } from "../Block";

export const oak_log = new Block("oak_log", ["oak_log_face", "oak_log_side"], {
  prev: "oak_log_side",
  drops: "oak_log",
});
