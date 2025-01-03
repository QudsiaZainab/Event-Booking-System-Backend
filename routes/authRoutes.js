import express from 'express';
import { signup, login, getUserBookedEvents} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const authRouter = express.Router();

// User Signup Route
authRouter.post('/signup',signup);

// User Login Route
authRouter.post('/login', login);

authRouter.get('/userevents',authenticateToken, getUserBookedEvents);


export default authRouter;
