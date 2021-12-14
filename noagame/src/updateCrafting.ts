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
const shapedRecipes = [
  {
    req: { d: blocks.dirt.id },
    out: blocks.grass.id,
    amount: 1,
    shape: `d\nd`,
  },
];

export function gridToString() {
  let getInv = (i: number) =>
    (craftingInv.in[i] ? craftingInv.in[i][0].id : 0) || 0;
  return `${getInv(0)}.${getInv(1)}
${getInv(3)}.${getInv(2)}`;
}
export function gridCleanString() {
  // fancy regex to replace ".0", ".0.", and "0." except at the start without replacing something like "10."
  let fixed = ("\n" + gridToString())
    .replace(/0{1}\.0{1}/g, "")
    .replace(/\.?(?<!\w)(?<!\n)0{1}\.?/g, "")
    .trim();
  if (!fixed.split("\n").find((a) => !a.startsWith("0."))) {
    // detects if all lines start with `0.` and shifts them left if so
    fixed = fixed.replace(/0\.(?!0)/g, "");
  }
  return fixed;
}

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
  shapedRecipes.forEach((r) => {
    if (got) return;
    let realShape = r.shape;
    Object.keys(r.req).forEach((k) => {
      realShape = realShape.replace(new RegExp(k, "g"), r.req[k]);
    });
    let filtered = gridCleanString();
    if (realShape == filtered) {
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
