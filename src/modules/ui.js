import app from "./state";

function renderProjects() {
  const sidebar = document.getElementById("projects-container");
  sidebar.innerHTML = "";
  app.state.projects.forEach((project) => {
    const btn = document.createElement("button");
    btn.textContent = project.name;
    btn.onclick = () => {
      app.state.activeProjectId = project.id;
      renderTodos();
    };
    sidebar.appendChild(btn);
  });
}

function renderTodos() {
  const container = document.getElementById("tasks-container");
  const title = document.getElementById("project-title");
  const project = app.getActiveProject();
  title.textContent = project.name;
  container.innerHTML = "";
  project.todos.forEach((todo) => {
    const div = document.createElement("div");
    div.textContent = `${todo.title} ({$todo.dueDate})`;
    container.appendChild(div);
  });
}

export default {
  renderProjects,
  renderTodos,
};
