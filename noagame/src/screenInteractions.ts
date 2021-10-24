export function openScreen(id?: string) {
  [...document.querySelectorAll("[container]")].map((c) => c.removeAttribute("opened"));
  if (id) document.querySelector(`[container="${id}"]`).setAttribute("opened", "");
}

export default function initScreenInteractions() {
  ([...document.querySelectorAll("[open]")] as HTMLElement[]).forEach((open) => {
    open.onclick = function () {
      openScreen(open.getAttribute("open"));
    };
  });
}
