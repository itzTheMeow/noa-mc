import _ from "./_";
import noa from "./index";

type TouchDictionary = {
  up: boolean;
  "up-left": boolean;
  left: boolean;
  jump: boolean;
  right: boolean;
  "up-right": boolean;
  down: boolean;
};

export default function init() {
  let touching: TouchDictionary = {
    up: false,
    "up-left": false,
    left: false,
    jump: false,
    right: false,
    "up-right": false,
    down: false,
  };
  let lastHit: HTMLElement;

  function updateTouch(lh?: HTMLElement) {
    if (lh) lastHit = lh;
    if (!(window as any).touchMode) _("control-pad").style.display = "none";
    else _("control-pad").style.display = "";
    if (!touching.up && !touching["up-left"] && !touching["up-right"])
      _("up-left").style.display = _("up-right").style.display = "none";
    else _("up-left").style.display = _("up-right").style.display = "";

    noa.inputs.state = {
      ...noa.inputs.state,
      ...{
        forward: touching.up || touching["up-left"] || touching["up-right"],
        left: touching.left || touching["up-left"],
        right: touching.right || touching["up-right"],
        backward: touching.down,
        jump: touching.jump,
      },
    };
  }
  updateTouch();
  (window as any).updateTouch = updateTouch;

  function resetTouch() {
    Object.keys(touching).map((i) => {
      _(i).classList.remove("active");
      touching[i] = false;
    });
  }

  window.addEventListener("touchstart", (touch) => {
    if (!Object.keys(touching).includes((touch.target as HTMLElement).id)) return;
    (touch.target as HTMLElement).classList.add("active");
    touching[(touch.target as HTMLElement).id] = true;
    updateTouch(touch.target as HTMLElement);
  });

  window.addEventListener("touchmove", (touch) => {
    [...touch.touches].forEach((t) => {
      if (!Object.keys(touching).includes((t.target as HTMLElement).id)) return;
      let el = document.elementFromPoint(t.pageX, t.pageY);
      if (!el) return;
      resetTouch();
      if (Object.keys(touching).includes(el.id)) {
        el.classList.add("active");
        touching[el.id] = true;
        updateTouch(el as HTMLElement);
      } else if (el.id == "control-pad" && lastHit) {
        lastHit.classList.add("active");
        touching[lastHit.id] = true;
        updateTouch();
      }
    });
  });

  window.addEventListener("touchend", (touch) => {
    if (!Object.keys(touching).includes((touch.target as HTMLElement).id)) return;
    resetTouch();
    updateTouch();
  });
}
