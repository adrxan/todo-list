import app from "./state";
import { ViewMode } from "./constants";
import { showTaskForm } from "./form";
import { refreshIcons } from "./icons";

function renderProjects() {
  const sidebarViews = document.getElementById("projects-views");
  sidebarViews.innerHTML = "";

  const views = [
    { label: "All Tasks", mode: ViewMode.ALL, iconName: "layout-list" },
    { label: "Today", mode: ViewMode.TODAY, iconName: "calendar-clock" },
    { label: "Completed", mode: ViewMode.COMPLETED, iconName: "list-checks" },
  ];

  views.forEach(({ label, mode, iconName }) => {
    const btn = document.createElement("button");
    btn.classList.add("view-btn");
    btn.innerHTML = `<i data-lucide="${iconName}"></i> ${label}`;
    if (app.state.viewMode === mode) {
      btn.classList.add("selected");
    }

    btn.onclick = () => {
      app.setViewMode(mode);
      renderProjects();
      renderTasks();
    };
    sidebarViews.appendChild(btn);
    refreshIcons();
  });

  const sidebarProjects = document.getElementById("projects-container");
  sidebarProjects.innerHTML = "";
  app.state.projects.forEach((project) => {
    const btn = document.createElement("button");
    btn.textContent = project.name;

    if (
      app.state.viewMode === ViewMode.PROJECT &&
      project.id === app.state.activeProjectId
    ) {
      btn.classList.add("selected");
    }

    btn.onclick = () => {
      app.state.activeProjectId = project.id;
      app.setViewMode(ViewMode.PROJECT);
      renderProjects();
      renderTasks();
    };
    sidebarProjects.appendChild(btn);
  });

  const newProjectBtn = document.getElementById("new-project-btn");
  newProjectBtn.onclick = () => {
    const name = prompt("Project name:");
    if (!name || name.trim() === "") return;

    app.addProject(name);
    renderProjects();
    renderTasks();
  };
}

export function renderTasks() {
  const header = document.getElementById("tasks-header");
  const title = document.getElementById("project-title");
  const tableBody = document.getElementById("tasks-table-body");
  tableBody.innerHTML = "";

  const tasksToShow = [];

  const mode = app.state.viewMode;

  if (mode === ViewMode.PROJECT) {
    const project = app.getActiveProject();

    if (!project) {
      title.textContent = "No Project Selected";
      return;
    }

    title.textContent = project.name;
    tasksToShow.push(...project.tasks);
  }

  if (mode === ViewMode.ALL) {
    title.textContent = "All Tasks";
    app.state.projects.forEach((p) => tasksToShow.push(...p.tasks));
  }

  if (mode === ViewMode.TODAY) {
    title.textContent = "Today";
    const today = new Date().toISOString().split("T")[0];
    app.state.projects.forEach((p) => {
      tasksToShow.push(...p.tasks.filter((t) => t.dueDate === today));
    });
  }

  if (mode === ViewMode.COMPLETED) {
    title.textContent = "Completed";
    app.state.projects.forEach((p) => {
      tasksToShow.push(...p.tasks.filter((t) => t.completed));
    });
  }

  const oldForm = document.getElementById("new-task-form");
  if (oldForm) oldForm.remove();

  const oldAddBtn = document.getElementById("add-task-btn");
  if (oldAddBtn) oldAddBtn.remove();

  if (app.state.viewMode === ViewMode.PROJECT) {
    const addTaskBtn = document.createElement("button");
    addTaskBtn.textContent = "Add Task";
    addTaskBtn.id = "add-task-btn";

    addTaskBtn.onclick = () => {
      showTaskForm();
    };

    header.append(addTaskBtn);
  }

  tasksToShow.forEach((task) => {
    const row = document.createElement("tr");

    const doneCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => {
      task.completed = checkbox.checked;
      renderTasks();
    };
    doneCell.appendChild(checkbox);
    row.appendChild(doneCell);

    const titleCell = document.createElement("td");
    titleCell.textContent = task.title;
    row.appendChild(titleCell);

    const dateCell = document.createElement("td");
    dateCell.textContent = task.dueDate || "-";
    row.appendChild(dateCell);

    const priorityCell = document.createElement("td");
    priorityCell.textContent = task.priority || "None";
    row.appendChild(priorityCell);

    const actionsCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<i data-lucide="trash-2"></i>`;
    deleteBtn.onclick = () => {
      const project = app.state.projects.find((p) => p.tasks.includes(task));
      if (!project) return;
      project.tasks = project.tasks.filter((t) => t !== task);
      renderTasks();
    };

    actionsCell.appendChild(deleteBtn);
    row.appendChild(actionsCell);

    tableBody.appendChild(row);
    refreshIcons();
  });
}

export default {
  renderProjects,
  renderTasks,
};
