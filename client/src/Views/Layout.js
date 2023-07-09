import React ,{useEffect,useState}from 'react';
import axios from 'axios';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Switch, ThemeProvider, createTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import '../App.css';

const useStyles = makeStyles((theme) => ({
  appBar: {
    marginBottom: theme.spacing(2),
  },
  layout: {
  //   background: '#141E30',
  //   background: 'linear-gradient(to right, #243B55, #141E30)',
    color: theme.palette.mode === 'dark' ? '#141E30' : '#000000',

    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  link: {
    margin: theme.spacing(0, 2),
    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
    textDecoration: 'none',
  },
  container: {
    marginTop: theme.spacing(8),
  },
}));

const Layout = () => {
  const location = useLocation();
  const [id,setId]=useState('')
  const loggedIn = location.pathname !== '/login' && location.pathname !== '/register';
  const classes = useStyles();
  const [darkMode, setDarkMode] = React.useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const handleDarkModeToggle = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  useEffect(() => {
    // Fetch user data from the backend
    axios.get(`http://localhost:8000/api/user/`, { withCredentials: true })
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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link className={classes.link} to="/">
              App Name
              </Link>
            </Typography>
            <Switch checked={darkMode} onChange={handleDarkModeToggle} icon={<Brightness4 />} checkedIcon={<Brightness7 />} />
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" className={classes.container}>
          <nav>
            <Link className={classes.link} to="/">
              Home
            </Link>
            {loggedIn ? (
              <>
                <Link className={classes.link} to="/profile">
                  Profile
                </Link>
                <Link className={classes.link} to="/logout">
                  Logout
                </Link>
            <Link className={classes.link} to={`/post/${id}`} >Create a Post</Link>

              </>
            ) : (
              <>
                <Link className={classes.link} to="/login">
                  Login
                </Link>
                <Link className={classes.link} to="/register">
                  Register
                </Link>
              </>
            )}

          </nav>
          <Outlet />
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
