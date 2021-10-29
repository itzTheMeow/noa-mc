import { Block } from "../Block";

export const grass = new Block("grass", ["grass_top", "dirt", "grass_side"], {
  prev: "grass_side",
  drops: "dirt",
});
