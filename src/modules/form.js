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
        <label
            >Title <input type="text" name="title" required
        /></label>
        <label>Due Date <input type="date" name="dueDate" /></label>
        <label
            >Priority
            <select name="priority">
                <option value=" ">None</option>
                <option value="!">Low</option>
                <option value="!!">Medium</option>
                <option value="!!!">High</option>
            </select>
        </label>
        <div class="actions">
            <button type="submit" id="submit-form-btn">Add</button>
            <button type="button" id="cancel-btn">Cancel</button>
        </div>
    </form>`;

  modal.classList.add("side-modal");

  const panel = document.getElementById("side-panel");
  panel.appendChild(modal);

  const form = modal.querySelector("#new-task-form");
  form.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    const newTask = createTask({
      title: formData.get("title"),
      dueDate: formData.get("dueDate"),
      priority: formData.get("priority"),
    });

    const project = app.getActiveProject();
    if (!project) {
      alert("No active project selected.");
      return;
    }

    project.tasks.push(newTask);
    closeTaskForm();
    renderTasks();
  };

  modal.querySelector("#cancel-btn").onclick = closeTaskForm;
}

export function closeTaskForm() {
  const modal = document.getElementById("task-modal");
  if (modal) modal.remove();
}
