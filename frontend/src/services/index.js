import api from './api';

// Auth services
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// User services
export const userService = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
};

// Project services
export const projectService = {
  createProject: (data) => api.post('/projects', data),
  getAllProjects: () => api.get('/projects'),
  getProjectById: (id) => api.get(`/projects/${id}`),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  addMember: (data) => api.post('/projects/members/add', data),
  removeMember: (data) => api.post('/projects/members/remove', data),
};

// Task services
export const taskService = {
  createTask: (data) => api.post('/tasks', data),
  getMyTasks: () => api.get('/tasks/my-tasks'),
  getTasksByProject: (projectId) => api.get(`/tasks/project/${projectId}`),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};
