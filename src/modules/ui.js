import app from "./state";
import { ViewMode } from "./constants";
import { showTaskForm } from "./form";
import { showTaskDetails, isTaskCurrentlyViewed } from "./taskdetails";
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
  });
  refreshIcons();

  const sidebarProjects = document.getElementById("projects-container");
  sidebarProjects.innerHTML = "";
  app.state.projects.forEach((project) => {
    const btn = document.createElement("button");
    btn.textContent = project.name;
    btn.classList.add("project-btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<i data-lucide="trash-2"></i>`;
    deleteBtn.classList.add("delete-btn");
    deleteBtn.style.display = "none";
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      const confirmDelete = confirm(
        `Are you sure you want to delete the project "${project.name}"? This action cannot be undone.`,
      );
      if (confirmDelete) {
        if (app.state.projects) {
          app.state.projects = app.state.projects.filter(
            (p) => p.id !== project.id,
          );
        }

        if (app.state.activeProjectId === project.id) {
          app.state.activeProjectId = null;
          app.setViewMode(ViewMode.ALL);
        }
        renderProjects();
        renderTasks();
      }
    };

    btn.addEventListener("mouseenter", () => {
      deleteBtn.style.display = "block";
    });

    btn.addEventListener("mouseleave", () => {
      deleteBtn.style.display = "none";
    });

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
    btn.appendChild(deleteBtn);
    refreshIcons();
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

  const oldAddBtn = document.getElementById("new-task-btn");
  if (oldAddBtn) oldAddBtn.remove();

  const oldForm = document.getElementById("new-task-form");
  if (oldForm) oldForm.remove();

  const tasksToShow = [];
  const mode = app.state.viewMode;

  const newTaskBtn = document.createElement("button");
  newTaskBtn.id = "new-task-btn";
  newTaskBtn.textContent = "New Task";
  newTaskBtn.onclick = () => showTaskForm();
  header.append(newTaskBtn);

  if (mode === ViewMode.PROJECT) {
    const project = app.getActiveProject();

    if (!project) {
      title.textContent = "No Project Selected";
      newTaskBtn.style.display = "none";
      return;
    }

    title.textContent = `Projects / ${project.name}`;
    tasksToShow.push(...project.tasks);
    newTaskBtn.style.display = "block";
  } else if (mode === ViewMode.ALL) {
    title.textContent = "All Tasks";
    newTaskBtn.style.display = "none";
    app.state.projects.forEach((p) => tasksToShow.push(...p.tasks));
  } else if (mode === ViewMode.TODAY) {
    title.textContent = "Today";
    newTaskBtn.style.display = "none";
    const today = new Date().toISOString().split("T")[0];
    app.state.projects.forEach((p) => {
      tasksToShow.push(...p.tasks.filter((t) => t.dueDate === today));
    });
  } else if (mode === ViewMode.COMPLETED) {
    title.textContent = "Completed";
    newTaskBtn.style.display = "none";
    app.state.projects.forEach((p) => {
      tasksToShow.push(...p.tasks.filter((t) => t.completed));
    });
  }

  tasksToShow.sort((a, b) => {
    if (a.completed !== b.completed) {
      return Number(a.completed) - Number(b.completed);
    }

    return b.id - a.id;
  });

  const fragment = document.createDocumentFragment();

  tasksToShow.forEach((task) => {
    const row = document.createElement("tr");
    row.dataset.taskId = task.id;

    const doneCell = document.createElement("td");

    const customCheckboxContainer = document.createElement("div");
    customCheckboxContainer.classList.add("custom-checkbox");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => {
      task.completed = checkbox.checked;
      renderTasks();
      if (isTaskCurrentlyViewed(task.id)) {
        showTaskDetails(task);
      }
    };
    customCheckboxContainer.appendChild(checkbox);

    const customIconDisplay = document.createElement("span");
    customIconDisplay.classList.add("custom-icon-display");
    customCheckboxContainer.appendChild(customIconDisplay);

    const iconName = checkbox.checked ? "square-check" : "square";
    customIconDisplay.innerHTML = `<i data-lucide="${iconName}"></i>`;

    doneCell.appendChild(customCheckboxContainer);
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

    const viewBtn = document.createElement("button");
    viewBtn.innerHTML = `<i data-lucide="info"></i>`;
    viewBtn.classList.add("view-btn");
    viewBtn.onclick = () => {
      showTaskDetails(task);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<i data-lucide="trash-2"></i>`;
    deleteBtn.onclick = () => {
      const project = app.state.projects.find((p) => p.tasks.includes(task));
      if (!project) return;
      project.tasks = project.tasks.filter((t) => t !== task);
      renderTasks();
    };

    actionsCell.append(viewBtn);
    actionsCell.appendChild(deleteBtn);
    row.appendChild(actionsCell);

    fragment.appendChild(row);

    if (task.completed) {
      row.classList.add("completed");
    }
  });

  tableBody.appendChild(fragment);
  refreshIcons();
}

export default {
  renderProjects,
  renderTasks,
};
