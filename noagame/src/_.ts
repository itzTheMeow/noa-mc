export default function _(id: string): HTMLElement {
  return (
    document.getElementById(id) ||
    (console.log("Error getting element..."), document.createElement("div"))
  );
}
