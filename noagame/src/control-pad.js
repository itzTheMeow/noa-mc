import _ from "./_";

let touching = {
  up: false,
  "up-left": false,
  left: false,
  jump: false,
  right: false,
  "up-right": false,
  down: false,
};

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
    }
  });
});
window.addEventListener("touchend", (touch) => {
  if (!Object.keys(touching).includes(touch.target.id)) return;
  resetTouch();
});
