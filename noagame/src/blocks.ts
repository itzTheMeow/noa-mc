import { Block } from "./Block";
import { dirt } from "./blocks/dirt";
import { grass } from "./blocks/grass";
import { stone } from "./blocks/stone";

let blocks: { [key: string]: Block } = {};
let list = [dirt, grass, stone];
list.forEach((l) => {
  blocks[l.name] = l;
});

export default blocks;
