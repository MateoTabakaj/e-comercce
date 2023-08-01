import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Switch,
  ThemeProvider,
  createTheme,
  Menu,
  MenuItem,
  IconButton,
  
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Brightness4, Brightness7, AccountCircle, Search } from '@mui/icons-material';
import '../App.css';
import UserSearch from '../Components/UserSearch';

const useStyles = makeStyles((theme) => ({
  appBar: {
    marginBottom: theme.spacing(2),
  },
  layout: {
    color: theme.palette.mode === 'dark' ? 'white' : 'black',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  link: {
    margin: theme.spacing(0, 2),
    color: theme.palette.mode === 'dark' ? 'light' : 'black',
    textDecoration: 'none',
  },
  container: {
    marginTop: theme.spacing(8),
  },
  homeLink: {
    color: theme.palette.mode === 'dark' ? 'white' : 'inherit',
  },
}));

const Layout = () => {
  const location = useLocation();
  const [id, setId] = useState('');
  const loggedIn = location.pathname !== '/login' && location.pathname !== '/register';
  const classes = useStyles();
  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const handleDarkModeToggle = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    // Fetch user data from the backend
    axios
      .get(`http://localhost:8000/api/user/`, { withCredentials: true })
      .then((response) => {
        setId(response.data.user._id);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.layout}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              <Link className={`${classes.link} ${classes.homeLink}`} to="/">
                PentaGram
              </Link>
            </Typography>
            <Typography variant="h2" component="h1" gutterBottom>
              <Link className={`${classes.link} ${classes.homeLink}`} to="/search">
                <IconButton className={classes.searchIcon} color="inherit">
                  <Search />
                </IconButton>
              </Link>
            </Typography>
            <Switch checked={darkMode} onChange={handleDarkModeToggle} icon={<Brightness4 />} checkedIcon={<Brightness7 />} />
            {loggedIn && (
              <div>
                <IconButton onClick={handleMenuOpen} color="inherit">
                  <AccountCircle />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem component={Link} to={`/profile/${id}`} onClick={handleMenuClose}>
                    Profile
                  </MenuItem>
                  <MenuItem component={Link} to="/logout" onClick={handleMenuClose}>
                    Logout
                  </MenuItem>
                  <MenuItem component={Link} to={`/post/${id}`} onClick={handleMenuClose}>
                    Create a Post
                  </MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" className={classes.container}>
          <nav>
            {!loggedIn ? (
              <>
                <Link className={classes.link} to="/login">
                  Login
                </Link>
                <Link className={classes.link} to="/register">
                  Register
                </Link>
              </>
            ) : null}
          </nav>
          <Outlet />
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
