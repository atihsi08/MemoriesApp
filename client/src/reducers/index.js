import { combineReducers } from 'redux';
import { posts } from './posts';
import { authReducer } from './auth.js';
export default combineReducers({
    posts,
    authReducer
})