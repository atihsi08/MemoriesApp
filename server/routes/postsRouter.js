import express from 'express';
import { auth } from '../middleware/auth.js';
import { postsController } from '../controllers/postsController.js';

export const postsRouter = express.Router();

postsRouter.get('/creator', postsController.getPostsByCreator);

postsRouter.get('/search', postsController.getPostsBySearch);

postsRouter.get('/', postsController.getPosts);

postsRouter.get('/:id', postsController.getPost);

postsRouter.post('/', auth, postsController.createPost);

postsRouter.patch('/:id', auth, postsController.updatePost);

postsRouter.delete('/:id', auth, postsController.deletePost);

postsRouter.patch('/:id/likePost', auth, postsController.likePost);

postsRouter.post('/:id/commentPost', auth, postsController.commentPost);
