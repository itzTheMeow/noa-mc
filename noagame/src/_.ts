export default function _(id: string) {
  return (
    document.getElementById(id) ||
    (console.log("Error getting element..."), document.createElement("div"))
  );
}
