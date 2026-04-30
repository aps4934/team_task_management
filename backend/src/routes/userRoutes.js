import express from 'express';
import { getAllUsers, getUserById, updateUser } from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

router.get('/', auth, getAllUsers);
router.get('/:id', auth, getUserById);
router.put('/:id', auth, updateUser);

export default router;
