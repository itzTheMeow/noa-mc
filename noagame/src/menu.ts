import { openScreen } from "./screenInteractions";
import _ from "./_";

export function toggleMenu(show: boolean | null = null) {
  let shown = _("menu").style.display == "block";
  if (show == null) show = !shown;
  if (show) {
    openScreen("index");
    _("menu").style.display = "block";
  } else {
    _("menu").style.display = "none";
  }
}
