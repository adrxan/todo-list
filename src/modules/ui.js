import app from "./state";
import { ViewMode } from "./constants";

import {
  createIcons,
  Plus,
  LayoutList,
  CalendarClock,
  ListChecks,
} from "lucide";

function renderProjects() {
  const sidebarViews = document.getElementById("projects-views");
  sidebarViews.innerHTML = "";

  const views = [
    { label: "All", mode: ViewMode.ALL, iconName: "layout-list" },
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
    if (!name) return;

    app.addProject(name);
    renderProjects();
    renderTodos();
  };
}

function renderTodos() {
  const container = document.getElementById("tasks-container");
  const title = document.getElementById("project-title");
  const list = document.getElementById("tasks-container");
  list.innerHTML = "";

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
    const div = document.createElement("div");
    div.textContent - `${todo.title} - ${todo.dueDate}`;
    list.appendChild(div);
  });

  // const project = app.getActiveProject();
  // title.textContent = project.name;
  // container.innerHTML = "";
  // project.todos.forEach((todo) => {
  //   const div = document.createElement("div");
  //   div.textContent = `${todo.title} (${todo.dueDate})`;
  //   container.appendChild(div);
  // });
}

export default {
  renderProjects,
  renderTodos,
};
