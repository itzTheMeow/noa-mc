import { craftingInv } from ".";
import blocks from "./blocks";
import setInventoryItem from "./setInventoryItem";

export function updateCrafting() {
  if (craftingInv.in[0] && craftingInv.in[0][0] == blocks.grass)
    return setInventoryItem(blocks.dirt, 0, "craftingout", craftingInv.in[0][1], "=");
  setInventoryItem(null, 0, "craftingout");
}

export function finishCraft(): [number, boolean, () => void] {
  let finalize = [];
  let amt = 1;
  let empty = 0;
  craftingInv.in.forEach((i, ind) => {
    if (!i) return;
    let amt = i[1] - 1;
    finalize.push([amt == 0 ? null : i[0], ind, "craftingin", amt, "="]);
    if (amt == 0) empty++;
  });
  return [
    amt,
    empty == 4 ? true : false,
    () => {
      //@ts-ignore
      finalize.map((f) => setInventoryItem(...f));
    },
  ];
}
