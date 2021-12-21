import axios from 'axios';

const API = axios.create();

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }

    return req;
})

export const fetchPost = async (id) => {
    return await API.get(`/posts/${id}`);
}

export const fetchPosts = async (page) => {
    return await API.get(`/posts?page=${page}`);
}

export const fetchPostsByCreator = (name) => {
    return API.get(`/posts/creator?name=${name}`);
}

export const fetchPostsBySearch = async (searchQuery) => {
    return await API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`)
}

export const createPost = async (newPost) => {
    return await API.post('/posts', newPost);
}

export const updatePost = async (id, updatedPost) => {
    return await API.patch(`/posts/${id}`, updatedPost);
}

export const deletePost = async (id) => {
    return await API.delete(`/posts/${id}`);
}

export const likePost = async (id) => {
    return await API.patch(`/posts/${id}/likePost`);
}

export const comment = async (finalComment, id) => {
    return await API.post(`/posts/${id}/commentPost`, { finalComment });
}

export const signIn = async (formData) => {
    return await API.post('/users/signin', formData);
}

export const signUp = async (formData) => {
    return await API.post('/users/signup', formData);
}