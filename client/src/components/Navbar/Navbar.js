import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { AppBar, Avatar, Button, Toolbar, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import decode from 'jwt-decode';
import { LOGOUT } from '../../constants/actionTypes';
import memoriesLogo from '../../images/memories-Logo.png';
import memoriesText from '../../images/memories-Text.png';
import { deepPurple } from '@mui/material/colors';

const useStyles = makeStyles({
    appBar: {
        borderRadius: 15,
        margin: '30px 0',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 50px',
    },
    heading: {
        color: 'rgba(0,183,255, 1)',
        textDecoration: 'none',
        fontSize: '2em',
        fontWeight: 300,
    },
    image: {
        marginLeft: '10px',
        marginTop: '5px'
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '400px',
    },
    profile: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '400px',
        alignItems: 'center',
    },
    logout: {
        marginLeft: '20px',
    },
    userName: {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
    },
    brandContainer: {
        display: 'flex',
        alignItems: 'center',
    }
})

function Navbar({ matches }) {
    const theme = useTheme();
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

    const logout = () => {
        dispatch({ type: LOGOUT });
        navigate('/auth');
        setUser(null);
    }

    useEffect(() => {
        const token = user?.token;
        if (token) {
            const decodedToken = decode(token);

            if (decodedToken.exp * 1000 < new Date().getTime())
                logout();
        }
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location])

    return (
        <AppBar position="static" color="inherit" className={classes.appBar} style={{ flexDirection: matches && 'column' }}>
            <Link to="/" className={classes.brandContainer}>
                <img component={Link} src={memoriesText} alt="Memories" height="45px" />
                <img src={memoriesLogo} alt="Memories" height="40px" className={classes.image} />
            </Link>
            <Toolbar className={classes.toolbar}>
                {user?.result ? (
                    <div className={classes.profile} style={{ flexDirection: matches && 'column', marginTop: matches && '20px' }}>
                        <Avatar
                            alt={user?.result.name}
                            src={user?.result.imageUrl}
                            style={{
                                color: theme.palette.getContrastText(deepPurple[500]),
                                backgroundColor: deepPurple[500],
                            }}
                        >
                            {user?.result.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography className={classes.userName} variant="h6">{user?.result.name}</Typography>
                        <Button variant="contained" color='secondary' onClick={logout}>Logout</Button>
                    </div>
                ) : (
                    <Button component={Link} to="/auth" color="primary" variant="contained">Sign In</Button>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
