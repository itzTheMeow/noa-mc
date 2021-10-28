import { Block } from "./Block";
import { bedrock } from "./blocks/bedrock";
import { cobblestone } from "./blocks/cobblestone";
import { dirt } from "./blocks/dirt";
import { grass } from "./blocks/grass";
import { gravel } from "./blocks/gravel";
import { planks } from "./blocks/planks";
import { sand } from "./blocks/sand";
import { stone } from "./blocks/stone";

let blocks: { [key: string]: Block } = {};
let list = [dirt, grass, stone, planks, sand, gravel, bedrock, cobblestone];
list.forEach((l) => {
  blocks[l.name] = l;
});

export default blocks;
