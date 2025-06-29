import { clearSidePanel } from "./sidePanel";
// import { refreshIcons } from "./icons";

let currentViewedTaskId = null;

export function showTaskDetails(task) {
  currentViewedTaskId = task.id;

  const panel = document.getElementById("side-panel");
  if (!panel) return;
  panel.innerHTML = `
    <div class="task-details-content">
          <h3>${task.title}</h3>
          <p><strong>Description:</strong> ${task.description || "None"}</p>
          <p><strong>Due Date:</strong> ${task.dueDate || "None"}</p>
          <p><strong>Priority:</strong> ${task.priority || "None"}</p>
          <p><strong>Notes:</strong> ${task.notes || "None"}</p>
          <p><strong>Status:</strong> ${task.completed ? "Completed" : "Incomplete"}</p>
          <button id="close-details-btn"><i data-lucide="x"></i> Close</button>
        </div>
    `;

  function clearSelectedRowHighlight() {
    document
      .querySelectorAll("tr.selected")
      .forEach((el) => el.classList.remove("selected"));
  }

  document.getElementById("close-details-btn").onclick = () => {
    clearSidePanel();
    currentViewedTaskId = null;
    clearSelectedRowHighlight();
  };

  clearSelectedRowHighlight();
  const row = document.querySelector(`tr[data-task-id="${task.id}"]`);
  if (row) row.classList.add("selected");
}

export function isTaskCurrentlyViewed(taskId) {
  return taskId === currentViewedTaskId;
}
