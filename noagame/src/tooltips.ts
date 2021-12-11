import { GameOptions } from ".";
import _ from "./_";

const tooltipBox = _("tooltip");
const tooltipTitle = _("tooltip-title");

export function updateTooltip(element: HTMLElement) {
  let tip = element.getAttribute("tip");
  if (tip) setTooltip(tip);
  else clearTooltip();
}

export function initTooltip() {
  clearTooltip();
  document.body.onmousemove = function (ev) {
    tooltipBox.style.top = `${ev.pageY - GameOptions.hotbarScale * 4}px`;
    tooltipBox.style.left = `${ev.pageX + GameOptions.hotbarScale * 6}px`;
    updateTooltip(ev.target as HTMLElement);
  };
  document.body.onmouseleave = function () {
    clearTooltip();
  };
  document.body.onclick = function (ev) {
    updateTooltip(ev.target as HTMLElement);
  };
}

export function setTooltip(title: string) {
  tooltipBox.style.display = "";
  tooltipTitle.innerHTML = title;
}

export function clearTooltip() {
  tooltipBox.style.display = "none";
  tooltipTitle.innerHTML = "";
}
