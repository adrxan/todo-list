import { clearSidePanel } from "./sidePanel";
import { updateTask } from "./taskManager";
import { renderTasks } from "./ui";

let currentViewedTaskId = null;

export function showTaskDetails(task) {
  currentViewedTaskId = task.id;

  const panel = document.getElementById("side-panel");
  if (!panel) return;

  function renderViewMode() {
    panel.innerHTML = `
      <div class="task-details-content">
            <h3>${task.title}</h3>
            <p><strong>Description:</strong> ${task.description || "None"}</p>
            <p><strong>Due Date:</strong> ${task.dueDate || "None"}</p>
            <p><strong>Priority:</strong> ${task.priority || "None"}</p>
            <p><strong>Notes:</strong> ${task.notes || "None"}</p>
            <p><strong>Status:</strong> ${task.completed ? "Completed" : "Incomplete"}</p>
            <div class="details-actions">
              <button id="edit-details-btn"><i data-lucide="edit"></i> Edit</button>
              <button id="close-details-btn"><i data-lucide="x"></i> Close</button>
            </div>
          </div>
      `;
    document.getElementById("edit-details-btn").onclick = renderEditMode;
    document.getElementById("close-details-btn").onclick = () => {
      clearSidePanel();
      currentViewedTaskId = null;
      clearSelectedRowHighlight();
    };
  }

  function renderEditMode() {
    panel.innerHTML = `
      <div class="task-details-content">
            <h3>Edit Task</h3>
            <label for="edit-title">Title:</label>
            <input type="text" id="edit-title" value="${task.title}">
            <label for="edit-description">Description:</label>
            <textarea id="edit-description">${task.description || ""}</textarea>
            <label for="edit-dueDate">Due Date:</label>
            <input type="date" id="edit-dueDate" value="${task.dueDate || ""}">
            <label for="edit-priority">Priority:</label>
            <select id="edit-priority">
              <option value="None" ${task.priority === "None" ? "selected" : ""}>None</option>
              <option value="Low" ${task.priority === "Low" ? "selected" : ""}>Low</option>
              <option value="Medium" ${task.priority === "Medium" ? "selected" : ""}>Medium</option>
              <option value="High" ${task.priority === "High" ? "selected" : ""}>High</option>
            </select>
            <label for="edit-notes">Notes:</label>
            <textarea id="edit-notes">${task.notes || ""}</textarea>
            <label for="edit-completed">Completed:</label>
            <input type="checkbox" id="edit-completed" ${task.completed ? "checked" : ""}>
            <div class="details-actions">
              <button id="save-details-btn"><i data-lucide="save"></i> Save</button>
              <button id="cancel-edit-btn"><i data-lucide="x"></i> Cancel</button>
            </div>
          </div>
      `;

    document.getElementById("save-details-btn").onclick = () => {
      const updatedTask = {
        ...task,
        title: document.getElementById("edit-title").value,
        description: document.getElementById("edit-description").value,
        dueDate: document.getElementById("edit-dueDate").value,
        priority: document.getElementById("edit-priority").value,
        notes: document.getElementById("edit-notes").value,
        completed: document.getElementById("edit-completed").checked,
      };
      updateTask(updatedTask);
      renderTasks();
      showTaskDetails(updatedTask);
    };

    document.getElementById("cancel-edit-btn").onclick = renderViewMode;
  }

  function clearSelectedRowHighlight() {
    document
      .querySelectorAll("tr.selected")
      .forEach((el) => el.classList.remove("selected"));
  }

  renderViewMode();

  clearSelectedRowHighlight();
  const row = document.querySelector(`tr[data-task-id="${task.id}"]`);
  if (row) row.classList.add("selected");
}

export function isTaskCurrentlyViewed(taskId) {
  return taskId === currentViewedTaskId;
}
