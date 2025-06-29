import { createProject } from "./project";
import { ViewMode } from "./constants";

const LOCAL_STORAGE_KEY = "todoListState";

const state = {
  projects: [],
  activeProjectId: null,
  viewMode: ViewMode.PROJECT,
};

function saveState() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    Object.assign(state, parsedState);

    state.projects.forEach((project) => {
      project.tasks.forEach((task) => {});
    });
  }
}

function initializeApp() {
  loadState();
  if (state.projects.length === 0) {
    const defaultProject = createProject("Default");
    state.projects.push(defaultProject);
    state.activeProjectId = defaultProject.id;
    saveState();
  }
}

function getActiveProject() {
  return state.projects.find((p) => p.id === state.activeProjectId) || null;
}

function setViewMode(mode) {
  state.viewMode = mode;
  if (mode !== ViewMode.PROJECT) {
    state.activeProjectId = null;
  }
  saveState();
}

function addProject(name) {
  const newProject = createProject(name);
  state.projects.push(newProject);
  state.activeProjectId = newProject.id;
  saveState();
}

export default {
  state,
  initializeApp,
  getActiveProject,
  setViewMode,
  addProject,
  saveState,
};
