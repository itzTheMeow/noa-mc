import { craftingInv, hotbar, hotbarSelection, inventory } from "./index";
import { Block } from "./Block";

export type Bars = "hotbar" | "main" | "craftingin" | "craftingout";

function validItems(i: [Block | null, number]) {
  if (!i) return null;
  if (i[1] >= i[0].stackSize) return null;
  return i[0];
}

export default function setInventoryItem(
  item: Block | null,
  index: number | null = null,
  bar: Bars = "main",
  count: number = 0,
  act: "+" | "=" | "-" = "+"
) {
  let actNum = 0;
  if (act == "+") actNum = 1;
  if (act == "-") actNum = -1;

  if (index == null) {
    index = hotbar.map(validItems).indexOf(item);
    bar = "hotbar";
  }
  if (index == -1) {
    index = inventory.map(validItems).indexOf(item);
    bar = "main";
  }
  if (index == -1) {
    index = hotbar.indexOf(null);
    bar = "hotbar";
  }
  if (index == -1) {
    index = inventory.indexOf(null);
    bar = "main";
  }
  if (index == -1) return false;

  let change;
  switch (bar) {
    case "hotbar":
      change = hotbar;
      break;
    case "main":
      change = inventory;
      break;
    case "craftingin":
      change = craftingInv.in;
      break;
    case "craftingout":
      change = craftingInv.out;
      break;
  }

  let current = change[index] || [];
  let newCt = (count || current[1] || 0) + actNum;
  change[index] = item && newCt ? [item, newCt] : null;

  (window as any).setHotbarSelection(hotbarSelection);
  (window as any).updateHotbar();
  return true;
}
