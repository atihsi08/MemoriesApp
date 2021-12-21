import { Posts } from '../models/postsModel.js';
import mongoose from 'mongoose';

export const postsController = {
    getPost: async (req, res) => {
        try {
            const { id } = req.params;
            const post = await Posts.findById(id);
            res.status(200).json(post);
        } catch (error) {
            res.status(404).json({ message: error });
        }
    },
    getPosts: async (req, res) => {
        try {
            const { page } = req.query;
            const LIMIT = 8;
            const startIndex = (Number(page) - 1) * LIMIT;
            const total = await Posts.countDocuments({});
            const posts = await Posts.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
            res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },
    createPost: async (req, res) => {
        try {
            const post = req.body;
            const newPost = new Posts({ ...post, creator: req.userId, createdAt: new Date().toISOString() });
            await newPost.save();
            res.status(201).json(newPost);
        } catch (error) {
            res.status(409).json({ message: error.message });
        }
    },
    updatePost: async (req, res) => {
        try {
            const postId = req.params.id;
            const { title, message, creator, selectedFile, tags } = req.body;
            if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(404).send('No post with that id.');
            const updatedPost = { title, message, creator, selectedFile, tags, _id: postId };
            await Posts.findByIdAndUpdate(postId, updatedPost, { new: true });
            res.status(200).json(updatedPost);

        } catch (error) {
            res.status(409).json({ message: error });
        }
    },
    deletePost: async (req, res) => {
        try {
            const postId = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(404).send('No post with id.');
            await Posts.findByIdAndRemove({ _id: postId });
            res.status(200).json({ message: 'Post deleted successfully!' });
        } catch (error) {
            res.status(409).json({ message: error });
        }
    },
    likePost: async (req, res) => {
        try {
            const postId = req.params.id;

            if (!req.userId) return res.json({ message: 'Unauthenticated!!' });

            if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(404).send('No post with that id.');

            const post = await Posts.findById({ _id: postId });

            const index = post.likes.findIndex((id) => id === String(req.userId));
            if (index === -1) {
                post.likes.push(String(req.userId));
            } else {
                post.likes = post.likes.filter(id => id !== String(req.userId));
            }

            const updatePost = await Posts.findByIdAndUpdate({ _id: postId }, post, { new: true });
            res.status(200).json(updatePost);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    getPostsBySearch: async (req, res) => {
        try {
            const { searchQuery, tags } = req.query;
            const title = new RegExp(searchQuery, 'i');
            const posts = await Posts.find({
                $or: [{ title }, { tags: { $in: tags.split(',') } }]
            });
            res.json({ data: posts });
        } catch (error) {
            res.status(404).json({ message: error });
        }
    },
    getPostsByCreator: async (req, res) => {
        const { name } = req.query;

        try {
            const posts = await Posts.find({ name });

            res.json({ data: posts });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },
    commentPost: async (req, res) => {
        try {
            const { id } = req.params;
            const { finalComment } = req.body;

            const post = await Posts.findById(id);
            post.comments.push(finalComment);
            const updatedPost = await Posts.findByIdAndUpdate(id, post, { new: true });
            res.status(200).json(updatedPost);
        } catch (error) {
            res.status(404).json({ message: error });
        }
    },
}