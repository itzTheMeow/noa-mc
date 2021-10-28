import { GameOptions, hotbar, inventory } from ".";
import { Block } from "./Block";
import BlockPreview from "./blockPreview";
import blocks from "./blocks";
import setInventoryItem from "./setInventoryItem";
import _ from "./_";

let pickedUp: [Block, number] | null = null;

export function initInvActions() {
  let slots = [...document.querySelectorAll(".inv-slot")] as HTMLElement[];
  slots.forEach((s) => {
    s.addEventListener("mousedown", function () {
      let totalOfType = [...document.querySelectorAll(`.${[...s.classList.values()].join(".")}`)];
      let slotNum = totalOfType.indexOf(s);
      let type: "hotbar" | "main" = "main";
      let item = null;
      switch (s.classList.values()[s.classList.length - 1]) {
        case "inv-slot-hotbar":
          type = "hotbar";
          item = hotbar[slotNum];
          break;
        case "inv-slot-main":
          type = "main";
          item = inventory[slotNum];
          break;
        default:
          return;
      }
      if (pickedUp == null && item) {
        pickedUp = item;
        setInventoryItem(null, slotNum, type);
      } else if (pickedUp && !item) {
        setInventoryItem(pickedUp[0], slotNum, type, pickedUp[1], "=");
        pickedUp = null;
      } else if (pickedUp && item && pickedUp[0].id == item[0].id) {
        let total = pickedUp[1] + item[1];
        setInventoryItem(pickedUp[0], slotNum, type, Math.min(total, 64), "=");
        if (total > 64) pickedUp[1] = total - 64;
        else pickedUp = null;
      } else if (pickedUp && item) {
        setInventoryItem(pickedUp[0], slotNum, type, pickedUp[1], "=");
        pickedUp = item;
      }
    });
  });

  let lastPicked: [number, number] | null = null;
  let mouse = { x: 0, y: 0 };
  document.addEventListener("mousemove", (ev) => {
    mouse.x = ev.pageX;
    mouse.y = ev.pageY;
  });
  setInterval(async function () {
    let pu = _("picked-up");
    if (pickedUp) {
      pu.style.display = "block";
      pu.style.left = mouse.x + "px";
      pu.style.top = mouse.y + "px";

      if (_("inventory").style.display == "none") {
        setInventoryItem(pickedUp[0], undefined, undefined, pickedUp[1]);
        pickedUp = null;
        return;
      }

      if (!lastPicked || lastPicked[0] != pickedUp[0].id || lastPicked[1] != pickedUp[1]) {
        lastPicked = [pickedUp[0].id, pickedUp[1]];
        if (pu.firstChild) pu.firstChild.remove();

        let glcanv = document.createElement("canvas");
        glcanv.width = 16 * GameOptions.hotbarScale;
        glcanv.height = 16 * GameOptions.hotbarScale;
        glcanv.style.visibility = "none";

        let canv = document.createElement("canvas");
        canv.width = 16 * GameOptions.hotbarScale;
        canv.height = 16 * GameOptions.hotbarScale;

        pu.appendChild(canv);
        document.body.appendChild(glcanv);

        let prev = pickedUp[0].getPreviewTex();
        new BlockPreview(
          glcanv,
          canv,
          prev[0],
          prev[1],
          prev[2],
          pickedUp[0].flowerType,
          pickedUp[1]
        ).done;
      }
    } else pu.style.display = "none";
  });
}
