import { hotbar, hotbarSelection, inventory } from "./index";
import { Block } from "./Block";

function validItems(i: [Block | null, number]) {
  if (!i) return null;
  if (i[1] >= i[0].stackSize) return null;
  return i[0];
}

export default function setInventoryItem(
  item: Block | null,
  index: number | null = null,
  bar: boolean | null = null,
  count: number = 0,
  act: "+" | "=" | "-" = "+"
) {
  let actNum = 0;
  if (act == "+") actNum = 1;
  if (act == "-") actNum = -1;

  if (index == null) {
    index = hotbar.map(validItems).indexOf(item);
    bar = true;
  }
  if (index == -1) {
    index = inventory.map(validItems).indexOf(item);
    bar = false;
  }
  if (index == -1) {
    index = hotbar.indexOf(null);
    bar = true;
  }
  if (index == -1) {
    index = inventory.indexOf(null);
    bar = false;
  }
  if (index == -1) return false;

  let current = (bar ? hotbar : inventory)[index] || [];
  let newCt = (count || current[1] || 0) + actNum;
  (bar ? hotbar : inventory)[index] = item && newCt ? [item, newCt] : null;

  (window as any).setHotbarSelection(hotbarSelection);
  (window as any).updateHotbar();
  return true;
}
