import { craftingInv } from ".";
import blocks, { getBlock } from "./blocks";
import setInventoryItem from "./setInventoryItem";

const singleRecipes = [
  {
    req: blocks.oak_log.id,
    out: blocks.planks.id,
    amount: 4,
  },
  {
    req: blocks.cobblestone.id,
    out: blocks.stone.id,
    amount: 1,
  },
];

export function updateCrafting() {
  let got = false;
  singleRecipes.forEach((r) => {
    if (got) return;
    let filtered = craftingInv.in.filter((c) => c);
    if (filtered.length == 1 && filtered[0][0].id == r.req) {
      got = true;
      return setInventoryItem(getBlock(r.out), 0, "craftingout", r.amount, "=");
    }
    setInventoryItem(null, 0, "craftingout");
  });
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
