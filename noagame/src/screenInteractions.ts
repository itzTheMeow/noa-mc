import _ from "./_";

export function openScreen(id?: string) {
  [...document.querySelectorAll("[container]")].map((c) => c.removeAttribute("opened"));
  if (id) {
    let container = document.querySelector(`[container="${id}"]`);
    container.setAttribute("opened", "");
    _("menu").scrollTop = 0;
    if (container.classList.contains("scrollable"))
      !_("menu").classList.contains("scrollable") && _("menu").classList.add("scrollable");
    else _("menu").classList.remove("scrollable");
  }
}

export default function initScreenInteractions() {
  ([...document.querySelectorAll("[open]")] as HTMLElement[]).forEach((open) => {
    open.onclick = function () {
      openScreen(open.getAttribute("open"));
    };
  });
}
