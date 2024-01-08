import { Router } from 'express';
import { login, register } from '../controllers/authController';
const router = Router();

// route to register
router.post('/register', register);
// route to login
router.post('/login', login);

export default router;
