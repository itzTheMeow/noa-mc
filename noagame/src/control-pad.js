import _ from "./_";
import noa from "./index";

export default function init(opts) {
  let touching = {
    up: false,
    "up-left": false,
    left: false,
    jump: false,
    right: false,
    "up-right": false,
    down: false,
  };
  let lastHit = "";

  function updateTouch(lh) {
    if (lh) lastHit = lh;
    if (!opts.touchMode) _("control-pad").style.display = "none";
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
  function resetTouch() {
    Object.keys(touching).map((i) => {
      _(i).classList.remove("active");
      touching[i] = false;
    });
  }

  window.addEventListener("touchstart", (touch) => {
    if (!Object.keys(touching).includes(touch.target.id)) return;
    touch.target.classList.add("active");
    touching[touch.target.id] = true;
    updateTouch(touch.target);
  });
  window.addEventListener("touchmove", (touch) => {
    [...touch.touches].forEach((t) => {
      if (!Object.keys(touching).includes(t.target.id)) return;
      let el = document.elementFromPoint(t.pageX, t.pageY);
      if (!el) return;
      resetTouch();
      if (Object.keys(touching).includes(el.id)) {
        el.classList.add("active");
        touching[el.id] = true;
        updateTouch(el);
      } else if (el.id == "control-pad" && lastHit) {
        lastHit.classList.add("active");
        touching[lastHit.id] = true;
        updateTouch();
      }
    });
  });
  window.addEventListener("touchend", (touch) => {
    if (!Object.keys(touching).includes(touch.target.id)) return;
    resetTouch();
    updateTouch();
  });
}
