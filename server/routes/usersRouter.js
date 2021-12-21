import express from 'express';
import { usersController } from '../controllers/usersController.js';

export const usersRouter = express.Router();

usersRouter.post('/signin',usersController.signin);

usersRouter.post('/signup',usersController.signup);