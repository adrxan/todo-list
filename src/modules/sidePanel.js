export function clearSidePanel() {
  const panel = document.getElementById("side-panel");
  if (panel) panel.innerHTML = "";

  document
    .querySelectorAll("tr.selected")
    .forEach((el) => el.classList.remove("selected"));
}
