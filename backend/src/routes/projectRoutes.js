import express from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  addMemberToProject,
  removeMemberFromProject,
  deleteProject,
} from '../controllers/projectController.js';
import auth from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';
import { validateCreateProject } from '../validators/index.js';

const router = express.Router();

router.post('/', auth, validateCreateProject, createProject);
router.get('/', auth, getAllProjects);
router.get('/:id', auth, getProjectById);
router.put('/:id', auth, validateCreateProject, updateProject);
router.delete('/:id', auth, deleteProject);
router.post('/members/add', auth, authorize('admin'), addMemberToProject);
router.post('/members/remove', auth, authorize('admin'), removeMemberFromProject);

export default router;
