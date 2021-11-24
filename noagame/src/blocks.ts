import { Block } from "./Block";
import { barrier } from "./blocks/barrier";
import { bedrock } from "./blocks/bedrock";
import { cobblestone } from "./blocks/cobblestone";
import { dirt } from "./blocks/dirt";
import { grass } from "./blocks/grass";
import { gravel } from "./blocks/gravel";
import { leaves } from "./blocks/leaves";
import { oak_log } from "./blocks/oak_log";
import { planks } from "./blocks/planks";
import { planks_slab } from "./blocks/planks_slab";
import { sand } from "./blocks/sand";
import { stone } from "./blocks/stone";

let blocks: { [key: string]: Block } = {};
let list = [
  dirt,
  grass,
  stone,
  planks,
  sand,
  gravel,
  bedrock,
  cobblestone,
  planks_slab,
  oak_log,
  leaves,
  barrier,
];
list.forEach((l) => {
  blocks[l.name] = l;
});

export default blocks;
