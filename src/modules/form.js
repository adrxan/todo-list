import createTask from "./task";
import app from "./state";
import { renderTasks } from "./ui";

export function showTaskForm() {
  if (document.getElementById("task-modal")) return;

  const modal = document.createElement("div");
  modal.id = "task-modal";
  modal.innerHTML = `
    <form id="new-task-form">
      <h3>New Task</h3>
    </form> `;
}
