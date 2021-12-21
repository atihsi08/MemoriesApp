import React, { useState, useRef } from 'react';
import { Typography, TextField, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { commentPost } from '../../actions/posts.js';

const useStyles = makeStyles({
    commentsOuterContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    commentsInnerContainer: {
        height: '200px',
        overflowY: 'auto',
        marginRight: '30px',
    }
})

function CommentSection({ post }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [comments, setComments] = useState(post?.comments);
    const [comment, setComment] = useState("");
    const user = JSON.parse(localStorage.getItem('profile'));
    const commentsRef = useRef();

    const handleClick = () => {

        const newComments = dispatch(commentPost(`${user?.result?.name}: ${comment}`, post._id));
        setComments(newComments);
        setComment('');
        commentsRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <div>
            <div className={classes.commentsOuterContainer}>
                <div className={classes.commentsInnerContainer}>
                    <Typography gutterBottom variant="h6">
                        Comments
                    </Typography>
                    {
                        comments.map((c, i) => (
                            <Typography key={i} gutterBottom variant="subtitle1">
                                <strong>{c.split(': ')[0]}</strong> {c.split(':')[1]}
                            </Typography>
                        ))
                    }
                    <div ref={commentsRef} />
                </div>
                {
                    user?.result?.name &&
                    <div style={{ width: '70%' }}>
                        <Typography gutterBottom variant="h6">
                            Write a Comment
                        </Typography>
                        <TextField
                            fullWidth
                            rows={4}
                            variant="outlined"
                            label="Comment"
                            multiline
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button style={{ marginTop: '10px' }} fullWidth disabled={!comment.length} variant="contained" color="primary" onClick={handleClick}>Comment</Button>
                    </div>
                }
            </div>
        </div>
    )
}

export default CommentSection
