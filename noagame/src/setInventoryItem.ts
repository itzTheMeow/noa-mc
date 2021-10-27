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
  set: boolean = false
) {
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
  (bar ? hotbar : inventory)[index] = item
    ? [item, (count || current[1] || 0) + (set ? 0 : 1)]
    : null;

  (window as any).setHotbarSelection(hotbarSelection);
  (window as any).updateHotbar();
  return true;
}
