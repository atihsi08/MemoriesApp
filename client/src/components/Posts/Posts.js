import React from 'react';
import { useSelector } from 'react-redux';
import Post from './Post/Post.js';
import { Grid, CircularProgress } from '@mui/material';

function Posts({ setCurrentId }) {
    
    const { posts, isLoading } = useSelector((state) => state.posts);

    if (!posts.length && !isLoading) return 'No Posts';

    return (
        isLoading ? <CircularProgress /> :
            <Grid container alignItems="stretch" spacing={3} style={{
                display: 'flex',
            }}>
                {
                    posts?.map((post) => (
                        <Grid item key={post._id} xs={12} sm={12} md={6} lg={3}>
                            <Post post={post} setCurrentId={setCurrentId} />
                        </Grid>
                    ))
                }
            </Grid>
    )
}

export default Posts
