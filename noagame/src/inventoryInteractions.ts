import { craftingInv, GameOptions, hotbar, inventory } from ".";
import { Block } from "./Block";
import BlockPreview from "./blockPreview";
import blocks from "./blocks";
import setInventoryItem, { Bars } from "./setInventoryItem";
import { finishCraft, updateCrafting } from "./updateCrafting";
import _ from "./_";

let pickedUp: [Block, number] | null = null;

export function initInvActions() {
  let slots = [...document.querySelectorAll(".inv-slot")] as HTMLElement[];
  slots[0].parentElement.addEventListener("contextmenu", (e) => e.preventDefault());
  slots.forEach((s) => {
    s.addEventListener("mousedown", function (mouseEvent) {
      let right = mouseEvent.button == 2;

      let totalOfType = [...document.querySelectorAll(`.${[...s.classList.values()].join(".")}`)];
      let slotNum = totalOfType.indexOf(s);
      let type: Bars = "main";
      let item = null;
      switch (s.className.split(" ").pop()) {
        case "inv-slot-hotbar":
          type = "hotbar";
          item = hotbar[slotNum];
          break;
        case "inv-slot-main":
          type = "main";
          item = inventory[slotNum];
          break;
        case "inv-slot-craftingin":
          type = "craftingin";
          item = craftingInv.in[slotNum];
          break;
        case "inv-slot-craftingout":
          type = "craftingout";
          item = craftingInv.out[slotNum];
          break;
        default:
          return;
      }

      if (pickedUp == null && item && type == "craftingout") {
        let [amt, done, finalize] = finishCraft();
        finalize();
        pickedUp = [item[0], item[1]];
        setInventoryItem(done ? null : item[0], 0, "craftingout", item[1], "=");
      } else if (pickedUp && item && pickedUp[0].id == item[0].id && type == "craftingout") {
        let [amt, done, finalize] = finishCraft();
        let newAmt = pickedUp[1] + item[1];
        if (newAmt <= 64) {
          finalize();
          pickedUp = [item[0], newAmt];
          setInventoryItem(done ? null : item[0], 0, "craftingout", item[1], "=");
        }
      } else if (pickedUp == null && item && type !== "craftingout") {
        let amt = right ? Math.floor(item[1] / 2) : item[1];
        pickedUp = [item[0], amt];
        setInventoryItem(right ? item[0] : null, slotNum, type, item[1] - amt, "=");
      } else if (pickedUp && !item && type !== "craftingout") {
        setInventoryItem(pickedUp[0], slotNum, type, right ? 1 : pickedUp[1], "=");
        pickedUp = right ? (pickedUp[1] == 1 ? null : [pickedUp[0], pickedUp[1] - 1]) : null;
      } else if (pickedUp && item && pickedUp[0].id == item[0].id && type !== "craftingout") {
        let total = (right ? 1 : pickedUp[1]) + item[1];
        setInventoryItem(pickedUp[0], slotNum, type, Math.min(total, 64), "=");
        if (total > 64) pickedUp[1] = right ? pickedUp[1] : total - 64;
        else if (right) (pickedUp[1] -= 1) == 0 && (pickedUp = null);
        else pickedUp = null;
      } else if (pickedUp && item && !right && type !== "craftingout") {
        setInventoryItem(pickedUp[0], slotNum, type, pickedUp[1], "=");
        pickedUp = item;
      }

      updateCrafting();
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
        new BlockPreview(glcanv, canv, prev[0], prev[1], prev[2], pickedUp[0].type, pickedUp[1])
          .done;
      }
    } else pu.style.display = "none";
  });
}
