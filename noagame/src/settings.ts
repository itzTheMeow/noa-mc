import { GameOptions, setSensitivity } from ".";
import _ from "./_";

let settingsSliders = [
  {
    elem: _("setting-sensitivity"),
    name: "Sensitivity",
    get: () => GameOptions.sensitivity,
    set: (val: number) => setSensitivity(val),
  },
];

export default function initSettings() {
  settingsSliders.forEach((sett) => {
    let slider = sett.elem.querySelector("input");
    let slideText = sett.elem.querySelector("div");
    let change = () => {
      slideText.innerHTML = `${sett.name}: ${slider.value}`;
      sett.set(Number(slider.value));
    };

    slider.oninput = slider.onchange = change;
    slider.value = String(sett.get());
    change();
  });
}
