import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Posts from '../Posts/Posts.js';
import Form from '../Form/Form.js';
import { Container, Grow, Grid, Paper, TextField, Button, AppBar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { getPostsBySearch } from '../../actions/posts.js';
import Pagination from '../Pagination.js';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    appBarSearch: {
        borderRadius: 4,
        marginBottom: '1rem',
        display: 'flex',
        padding: '16px',
    },
    pagination: {
        borderRadius: 4,
        marginTop: '1rem',
        padding: '16px',
    }
});

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Home() {
    const classes = useStyles();
    const [currentId, setCurrentId] = useState(0);
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState([]);
    const dispatch = useDispatch();
    const query = useQuery();
    const navigate = useNavigate();
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const handleKeyPress = (e) => {
        if (e.keyCode === 13) {
            searchPost();
        }
    }

    const handleAddChip = (tag) => {
        setTags([...tags, tag]);
    }

    const handleDeleteChip = (chipToDelete) => {
        setTags(tags.filter(tag => tag !== chipToDelete));
    }

    const searchPost = () => {
        if (search.trim() || tags) {
            dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
            navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
            setSearch('');
            setTags([]);
        } else {
            navigate('/');
        }
    }

    return (
        <Grow in>
            <Container maxWidth="xl">
                <Grid
                    container
                    className={classes.gridContainer}
                    justifyContent="space-between"
                    alignItems="stretch"
                    spacing={3}
                    style={{ flexDirection: matches && 'column-reverse' }}
                >
                    <Grid item xs={12} sm={6} md={9}>
                        <Posts setCurrentId={setCurrentId} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppBar className={classes.appBarSearch} position="static" color="inherit">
                            <TextField
                                name="search"
                                variant="outlined"
                                label="Search Memories"
                                fullWidth
                                onKeyDown={handleKeyPress}
                                value={search}
                                onChange={(e) => { setSearch(e.target.value) }}
                            />
                            <ChipInput
                                style={{ margin: '10px 0' }}
                                value={tags}
                                onAdd={(chip) => handleAddChip(chip)}
                                onDelete={(chip) => handleDeleteChip(chip)}
                                label="Search Tags"
                                variant="outlined"
                            />
                            <Button onClick={searchPost} className={classes.searchButton} color="primary" variant="contained">Search</Button>
                        </AppBar>
                        <Form currentId={currentId} setCurrentId={setCurrentId} />
                        {(!searchQuery && !tags.length) && (
                            <Paper elevation={6} className={classes.pagination}>
                                <Pagination page={page} />
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Grow>
    )
}

export default Home
