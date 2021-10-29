import noa from ".";
import blocks from "./blocks";

export enum TreeTypes {
  oak,
}

export default function generateTree(x: number, y: number, z: number, type: TreeTypes) {
  let logType;
  if (type == TreeTypes.oak) logType = blocks.oak_log;

  [
    [x, y + 0, z],
    [x, y + 1, z],
    //[x, y + 2, z],
    //[x, y + 3, z],
  ].forEach((log) => {
    noa.setBlock(logType.id, log[0], log[1], log[2]);
  });

  let layout = [
    `
00000
00L00
0LLL0
00L00
00000`.trim(),
    `
00000
0LLL0
0LWL0
0LLL0
00000`.trim(),
    `
00000
00000
00W00
00000
00000`.trim(),
    `
00000
00000
00W00
00000
00000`.trim(),
    `
00000
00000
00W00
00000
00000`.trim(),
  ];
  let dict = {
    L: blocks.leaves.id,
    W: blocks.oak_log.id,
    "0": 0,
  };

  layout.forEach((l, layoutNum) => {
    let ll = l.split("\n");
    ll.forEach((layer, layerNum) => {
      let zz = z - Math.ceil(layer.length / 2) + layerNum + 1;
      layer.split("").forEach((block, blockNum) => {
        let xx = x - Math.ceil(ll.length / 2) + blockNum + 1;
        let blk = dict[block];
        if (blk) noa.setBlock(blk, xx, y + (ll.length - layoutNum - 1), zz);
      });
    });
  });

  return logType.id;
}
