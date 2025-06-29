import app from "./state";

export function updateTask(updatedTask) {
  const project = app.state.projects.find((p) =>
    p.tasks.some((t) => t.id === updatedTask.id),
  );

  if (project) {
    const taskIndex = project.tasks.findIndex((t) => t.id === updatedTask.id);

    if (taskIndex !== -1) {
      project.tasks[taskIndex] = updatedTask;
      app.saveState();
    }
  }
}
