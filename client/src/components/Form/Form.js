import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@mui/material';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, updatePost } from '../../actions/posts.js';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles'
import ChipInput from 'material-ui-chip-input';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
    },
}))

function Form({ currentId, setCurrentId }) {
    const [postData, setPostData] = useState({
        title: '',
        message: '',
        tags: [],
        selectedFile: '',
    })

    const theme = useTheme();
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const post = useSelector((state) => currentId ? state.posts.posts.find(post => post._id === currentId) : null);
    const user = JSON.parse(localStorage.getItem('profile'));

    useEffect(() => {
        if (!post?.title) clear();
        if (post) {
            setPostData(post);
        }
    }, [post])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentId) {
            dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
        }
        else {
            dispatch(createPost({ ...postData, name: user?.result?.name }, navigate));
        }
        clear();
    }

    const clear = () => {
        setCurrentId(0);
        setPostData({
            title: '',
            message: '',
            tags: [],
            selectedFile: '',
        })
    }

    if (!user?.result?.name) {
        return (
            <Paper className={classes.paper}>
                <Typography variant="h6" align="center">
                    Please Sign In to create your own memories and like other's memories.
                </Typography>
            </Paper>
        )
    }

    const handleAddChip = (tag) => {
        setPostData({ ...postData, tags: [...postData.tags, tag] });
    };

    const handleDeleteChip = (chipToDelete) => {
        setPostData({ ...postData, tags: postData.tags.filter((tag) => tag !== chipToDelete) });
    };

    return (
        <Paper style={{ padding: theme.spacing(2) }} elevation={6}>
            <form
                autoComplete="off"
                noValidate
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}
                className={classes.root}
                onSubmit={handleSubmit}
            >
                <Typography variant="h6">{currentId ? `Editing ${post?.title}` : "Creating a memory"}</Typography>

                <TextField
                    name="title"
                    variant="outlined"
                    label="Title"
                    fullWidth
                    value={postData.title}
                    onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                />
                <TextField
                    name="message"
                    variant="outlined"
                    label="Message"
                    fullWidth
                    multiline
                    rows={4}
                    value={postData.message}
                    onChange={(e) => setPostData({ ...postData, message: e.target.value })}
                />

                <div style={{ padding: '5px 0', width: '94%' }}>
                    <ChipInput
                        name="tags"
                        variant="outlined"
                        label="Tags"
                        fullWidth
                        value={postData.tags}
                        onAdd={(chip) => handleAddChip(chip)}
                        onDelete={(chip) => handleDeleteChip(chip)}
                    />
                </div>

                <div style={{
                    width: '97%',
                    margin: '10px 0',
                }} >
                    <FileBase
                        type="file"
                        multiple={false}
                        onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })}
                    />
                </div>

                <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    type="submit"
                    fullWidth
                    style={{ marginBottom: 10 }}
                >
                    SUBMIT
                </Button>

                <Button
                    variant="contained"
                    size="small"
                    color="secondary"
                    onClick={clear}
                    fullWidth
                >
                    CLEAR
                </Button>
            </form>
        </Paper>
    )
}

export default Form
