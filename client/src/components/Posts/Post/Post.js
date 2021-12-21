import React, { useState } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@mui/material';
import { useDispatch } from 'react-redux';
import { deletePost, likePost } from '../../../actions/posts.js';
import { useNavigate } from 'react-router-dom';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import moment from 'moment';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    media: {
        height: 0,
        paddingTop: '56.25%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlendMode: 'darken',
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '15px',
        height: '100%',
        position: 'relative',
    },
    overlay: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
    },
    overlay2: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        color: 'white',
    },
    grid: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '20px',
    },
    title: {
        padding: '0 16px',
    },
    cardActions: {
        padding: '0 16px 8px 16px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    cardAction: {
        display: 'block',
        textAlign: 'initial',

    },
})

function Post({ post, setCurrentId }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));
    const [likes, setLikes] = useState(post?.likes);
    const userId = user?.result?.googleId || user?.result?._id;
    const hasLikedPost = post.likes.find((like) => like === userId);

    const handleLike = () => {
        dispatch(likePost(post._id));
        if (hasLikedPost) {
            setLikes(post.likes.filter(id => id !== userId))
        }
        else {
            setLikes([...post.likes, userId]);
        }
    }

    const Likes = () => {
        if (likes?.length > 0) {
            return likes.find(like => like === userId)
                ? (
                    <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}`}</>
                ) : (
                    <><ThumbUpAltOutlinedIcon fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
                );
        }

        return <><ThumbUpAltOutlinedIcon fontSize="small" />&nbsp;Like</>;
    };

    const openPost = () => {
        navigate(`/posts/${post._id}`);
    }

    return (
        <Card className={classes.card} raised elevation={6}>
            <ButtonBase component="span" name="test" className={classes.cardAction} onClick={openPost}>
                <CardMedia className={classes.media} image={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.title} />
                <div className={classes.overlay}>
                    <Typography variant="h6">{post.name}</Typography>
                    <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
                </div>
                {
                    (user?.result?.googleId === post?.creator || user?.result?._id === post.creator) && (
                        <div className={classes.overlay2}>
                            <Button
                                style={{ color: "white" }}
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentId(post._id)
                                }}
                            >
                                <MoreHorizIcon fontSize="large" />
                            </Button>
                        </div>
                    )
                }
                <div className={classes.details}>
                    <Typography variant="body2" component="h2" color="textSecondary">{post.tags.map(tag => `#${tag} `)}</Typography>
                </div>
                <Typography component="h2" variant="h5" className={classes.title} gutterBottom>{post.title}</Typography>
                <CardContent>
                    <Typography component="p" variant="body2" color="textSecondary" component="p">{post.message.split(' ').splice(0, 20).join(' ')}...</Typography>
                </CardContent>
            </ButtonBase>
            <CardActions className={classes.cardActions}>
                <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>
                    <Likes />
                </Button>

                {
                    (user?.result?.googleId === post?.creator || user?.result?._id === post.creator) && (
                        <Button size="small" color="error" onClick={() => dispatch(deletePost(post._id))}>
                            <DeleteIcon fontSize="small" />
                            Delete
                        </Button>
                    )
                }
            </CardActions>
        </Card>
    )
}

export default Post
