import { createProject } from "./project";

const state = {
  projects: [],
  activeProjectId: null,
};

function initializeApp() {
  const defaultProject = createProject("Default");
  state.projects.push(defaultProject);
  state.activeProjectId = defaultProject.id;
}

function getActiveProject() {
  return state.projects.find((p) => p.id === state.activeProjectId);
}

export default {
  state,
  initializeApp,
  getActiveProject,
};
