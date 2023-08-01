import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button, Container, TextField, Typography, useTheme, Grid, InputAdornment, IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { makeStyles } from '@mui/styles';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(8),
    backgroundColor: theme.palette.mode === 'dark' ? 'black' : theme.palette.background.default,
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
  datePicker: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
}));

const RegistrationForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState("http://localhost:8000/uploads/profilepic.png");
  const [birthday, setBirthday] = useState(null);
  const [validation, setValidation] = useState({});
  const navigate = useNavigate();
  const classes = useStyles();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('userName', userName);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);
      formData.append('avatar', avatar);
      formData.append('birthday', birthday);

      const response = await axios.post('http://localhost:8000/api/register', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setValidation(error.response.data.errors);
      }
      console.log(error);
    }
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <Typography component="h1" variant="h5" color="textPrimary">
        Register
      </Typography>
      <form className={classes.form} onSubmit={handleRegister}>
        <input
          accept="image/*"
          onChange={handleAvatarChange}
          className={classes.input}
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
        />
        <label htmlFor="raised-button-file">
          <Button variant="outlined" color="success" component="span" className={classes.submitButton}>
            Choose profile avatar
          </Button>
        </label>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="firstName"
          label="First Name"
          name="firstName"
          autoComplete="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={!!validation.firstName}
          helperText={validation.firstName && validation.firstName.message}
          InputProps={{
            style: { color: theme.palette.text.primary },
          }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="lastName"
          label="Last Name"
          name="lastName"
          autoComplete="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={!!validation.lastName}
          helperText={validation.lastName && validation.lastName.message}
          InputProps={{
            style: { color: theme.palette.text.primary },
          }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="userName"
          label="Username"
          name="userName"
          autoComplete="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          error={!!validation.userName}
          helperText={validation.userName && validation.userName.message}
          InputProps={{
            style: { color: theme.palette.text.primary },
          }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!validation.email}
          helperText={validation.email && validation.email.message}
          InputProps={{
            style: { color: theme.palette.text.primary },
          }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="new-password"
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
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          id="confirmPassword"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!validation.confirmPassword}
          helperText={validation.confirmPassword && validation.confirmPassword.message}
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
        <DatePicker
          selected={birthday}
          onChange={(date) => setBirthday(date)}
          dateFormat="dd-MM-yyyy"
          placeholderText="Select Birthday"
          className={classes.datePicker}
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={100}
          yearDropdownScrollable
          peekNextMonth
          showMonthDropdown
          dropdownMode="select"
          customInput={
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="birthday"
              id="birthday"
              value={birthday ? birthday.toLocaleDateString() : ''}
              error={!!validation.birthday}
              helperText={validation.birthday && validation.birthday.message}
              InputProps={{
                style: { color: theme.palette.text.primary },
              }}
            />
          }
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submitButton}
        >
          Register
        </Button>
        <Grid container justifyContent="center" className={classes.registerLink}>
          <Grid item>
            <Link to="/login">Already registered? Login here</Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default RegistrationForm;
