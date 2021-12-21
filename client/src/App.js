import React from 'react';
import { Container } from '@mui/material';
import Home from './components/Home/Home.js';
import Auth from './components/Auth/Auth.js';
import { useTheme } from '@mui/material/styles';
import PostDetails from './components/PostDetails/PostDetails.js';
import CreatorOrTag from './components/CreatorOrTag/CreatorOrTag.js';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import Navbar from './components/Navbar/Navbar.js';

function App() {

    const user = JSON.parse(localStorage.getItem('profile'));
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Router>
            <Container maxWidth={matches ? "sm" : "xl"}>
                <Navbar matches={matches} />
                <Routes>
                    <Route exact path="/" element={<Navigate to="/posts" />} />
                    <Route exact path="/posts" element={<Home />} />
                    <Route exact path="/posts/search" element={<Home />} />
                    <Route exact path="/posts/:id" element={<PostDetails />} />
                    <Route path='/creators/:name' element={<CreatorOrTag />} />
                    <Route path='/tags/:name' element={<CreatorOrTag />} />
                    <Route exact path="/auth" element={!user ? <Auth /> : <Navigate to="/posts" />} />
                </Routes>
            </Container>
        </Router>
    )
}

export default App
