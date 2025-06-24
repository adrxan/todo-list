import "./styles.css";
import app from "./modules/state";
import ui from "./modules/ui";

document.addEventListener("DOMContentLoaded", () => {
  app.initializeApp();
  ui.renderProjects();
  ui.renderTodos();
});
