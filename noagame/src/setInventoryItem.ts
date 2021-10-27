import { hotbar, hotbarSelection, inventory } from "./index";
import { Block } from "./Block";

export default function setInventoryItem(
  item: Block | null,
  index: number | null = null,
  bar: boolean | null = null,
  count: number = 0
) {
  console.log(item, index, bar, count, hotbar, inventory);
  if (index == null) {
    index = hotbar.map((h) => (h ? h[0] : null)).indexOf(item);
    bar = true;
  }
  if (index == -1) {
    index = inventory.map((i) => (i ? i[0] : null)).indexOf(item);
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
  (bar ? hotbar : inventory)[index] = item ? [item, (count || current[1] || 0) + 1] : null;

  (window as any).setHotbarSelection(hotbarSelection);
  (window as any).updateHotbar();
  return true;
}
