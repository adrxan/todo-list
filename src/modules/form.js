import createTask from "./task";
import app from "./state";
import { renderTasks } from "./ui";
import { clearSidePanel } from "./sidePanel";

export function showTaskForm() {
  clearSidePanel();

  const panel = document.getElementById("side-panel");
  panel.innerHTML = `
    <form id="new-task-form">
        <h3>New Task</h3>
        <label
            >Title <input type="text" name="title" required
        /></label>
        <label>Description <input type="text" name="description" /></label>
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
        <label>Notes <textarea name="notes"></textarea></label>
        <div class="actions">
            <button type="submit" id="submit-form-btn">Add</button>
            <button type="button" id="cancel-btn">Cancel</button>
        </div>
    </form>`;

  const form = document.querySelector("#new-task-form");

  form.onsubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const title = formData.get("title").trim();

    if (!title) {
      alert("Task title is required.");
      return;
    }

    const newTask = createTask({
      title,
      description: formData.get("description") || "None",
      dueDate: formData.get("dueDate") || null,
      priority: formData.get("priority") || "None",
      notes: formData.get("notes") || "",
    });

    const project = app.getActiveProject();
    if (!project) {
      alert("No active project selected.");
      return;
    }

    project.tasks.push(newTask);

    clearSidePanel();
    renderTasks();
  };

  panel.querySelector("#cancel-btn").onclick = clearSidePanel;
}
