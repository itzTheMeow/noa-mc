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
  bar: "hotbar" | "main" = "main",
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

  let current = (bar == "hotbar" ? hotbar : inventory)[index] || [];
  let newCt = (count || current[1] || 0) + actNum;
  (bar == "hotbar" ? hotbar : inventory)[index] = item && newCt ? [item, newCt] : null;

  (window as any).setHotbarSelection(hotbarSelection);
  (window as any).updateHotbar();
  return true;
}
