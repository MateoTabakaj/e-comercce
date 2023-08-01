import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Container,
  TextField,
  Typography,
  useTheme,
  Grid,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// toast.configure()

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(8),
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.getContrastText(theme.palette.secondary.main),
  },
  registerLink: {
    marginTop: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  passwordInput: {
    position: 'relative',
  },
  passwordToggleIcon: {
    position: 'absolute',
    top: '40%',
    right: theme.spacing(1),
    transform: 'translateY(0%)',
  },
}));

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validation, setValidation] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const classes = useStyles();
  const theme = useTheme();



  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8000/api/login',
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success('User Logged In successfully');
        navigate('/');
    }
    } catch (error) {
      // setValidation(error.response.data.errors);
      console.log(error.response)
      // Handle error, e.g., show an error message
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <Typography component="h1" variant="h5" color="textPrimary">
        Login
      </Typography>
      <form className={classes.form} onSubmit={handleLogin}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!validation.email}
          helperText={validation.email && validation.email.message}
          InputProps={{
            style: { color: theme.palette.text.primary },
          }}
        />
        <div className={classes.passwordInput}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!validation.password}
            helperText={validation.password && validation.password.message}
            InputProps={{
              style: { color: theme.palette.text.primary },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    className={classes.passwordToggleIcon}
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submitButton}
        >
          Login
        </Button>
        <Grid container justifyContent="center" className={classes.registerLink}>
          <Grid item>
            <Link to="/register">Don't have an account? Register here</Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default LoginForm;
