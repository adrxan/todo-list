import app from "./state";
import { ViewMode } from "./constants";

import {
  createIcons,
  Plus,
  LayoutList,
  CalendarClock,
  ListChecks,
  Trash2,
} from "lucide";

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
      renderTodos();
    };
    sidebarViews.appendChild(btn);
    createIcons({
      icons: {
        Plus,
        LayoutList,
        CalendarClock,
        ListChecks,
      },
    });
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
      renderTodos();
    };
    sidebarProjects.appendChild(btn);
  });

  const newProjectBtn = document.getElementById("new-project-btn");
  newProjectBtn.onclick = () => {
    const name = prompt("Project name:");
    if (!name || name.trim() === "") return;

    app.addProject(name);
    renderProjects();
    renderTodos();
  };
}

function renderTodos() {
  const title = document.getElementById("project-title");
  const tableBody = document.getElementById("tasks-table-body");
  tableBody.innerHTML = "";

  const todosToShow = [];

  const mode = app.state.viewMode;

  if (mode === ViewMode.PROJECT) {
    const project = app.getActiveProject();

    if (!project) {
      title.textContent = "No Project Selected";
      return;
    }

    title.textContent = project.name;
    todosToShow.push(...project.todos);
  }

  if (mode === ViewMode.ALL) {
    title.textContent = "All Tasks";
    app.state.projects.forEach((p) => todosToShow.push(...p.todos));
  }

  if (mode === ViewMode.TODAY) {
    title.textContent = "Today";
    const today = new Date().toISOString().split("T")[0];
    app.state.projects.forEach((p) => {
      todosToShow.push(...p.todos.filter((t) => t.dueDate === today));
    });
  }

  if (mode === ViewMode.COMPLETED) {
    title.textContent = "Completed";
    app.state.projects.forEach((p) => {
      todosToShow.push(...p.todos.filter((t) => t.completed));
    });
  }

  todosToShow.forEach((todo) => {
    const row = document.createElement("tr");

    const doneCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.onchange = () => {
      todo.completed = checkbox.checked;
      renderTodos();
    };
    doneCell.appendChild(checkbox);
    row.appendChild(doneCell);

    const titleCell = document.createElement("td");
    titleCell.textContent = todo.title;
    row.appendChild(titleCell);

    const dateCell = document.createElement("td");
    dateCell.textContent = todo.dueDate || "-";
    row.appendChild(dateCell);

    const priorityCell = document.createElement("td");
    priorityCell.textContent = todo.priority || "None";
    row.appendChild(priorityCell);

    const actionsCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<i data-lucide="trash-2"></i>`;
    deleteBtn.onclick = () => {
      const project = app.state.projects.find((p) => p.todos.includes(todo));
      if (!project) return;
      project.todos = project.todos.filter((t) => t !== todo);
      renderTodos();
    };
    createIcons({
      icons: Trash2,
    });
    actionsCell.appendChild(deleteBtn);
    row.appendChild(actionsCell);

    tableBody.appendChild(row);
  });
}

export default {
  renderProjects,
  renderTodos,
};
