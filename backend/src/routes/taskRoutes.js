import express from 'express';
import {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  getMyTasks,
} from '../controllers/taskController.js';
import auth from '../middleware/auth.js';
import { validateCreateTask } from '../validators/index.js';

const router = express.Router();

router.post('/', auth, validateCreateTask, createTask);
router.get('/my-tasks', auth, getMyTasks);
router.get('/project/:projectId', auth, getTasksByProject);
router.get('/:id', auth, getTaskById);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

// Order matters - specific routes before :id routes

export default router;
