import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../validators/index.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', auth, getCurrentUser);

export default router;
