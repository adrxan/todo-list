import { createProject } from "./project";
import { ViewMode } from "./constants";

const state = {
  projects: [],
  activeProjectId: null,
  viewMode: ViewMode.PROJECT,
};

function initializeApp() {
  const defaultProject = createProject("Default");
  state.projects.push(defaultProject);
  state.activeProjectId = defaultProject.id;
}

function getActiveProject() {
  return state.projects.find((p) => p.id === state.activeProjectId) || null;
}

function setViewMode(mode) {
  state.viewMode = mode;
  if (mode !== ViewMode.PROJECT) {
    state.activeProjectId = null;
  }
}

function addProject(name) {
  const newProject = createProject(name);
  state.projects.push(newProject);
  state.activeProjectId = newProject.id;
}

export default {
  state,
  initializeApp,
  getActiveProject,
  setViewMode,
  addProject,
};
