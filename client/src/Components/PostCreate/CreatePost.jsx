import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    maxWidth: 400,
    margin: '0 auto',
  },
  submitButton: {
    alignSelf: 'flex-end',
  },
}));

const CreatePost = () => {
  const classes = useStyles();
  const [caption, setCaption] = useState('');
  const [validation, setValidation] = useState({});
  const [photo, setPhoto] = useState(null);
  const location = useLocation();
  const userId = location.pathname.split('/')[2];
  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };

  const handlePhotoChange = (event) => {
    setPhoto(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('photo', photo);

    axios.post(`http://localhost:8000/api/posts/${userId}`, formData, { withCredentials: true })
      .then((response) => {
        console.log(response.data);
        // Handle the response from the server
      })
      .catch((error) => {
        console.error(error.response.data.errors);
        setValidation(error.response.data.errors);
      });
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <input
        accept="image/*"
        onChange={handlePhotoChange}
        className={classes.input}
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
      />
      <label htmlFor="raised-button-file">
        <Button
          variant="outlined"
          color="success"
          component="span"
          className={classes.submitButton}
          error={!!validation.photo}
          helperText={validation.photo && validation.photo.message}
        >
          Choose profile avatar
        </Button>
      </label>
      <TextField
        label="Caption"
        variant="outlined"
        value={caption}
        onChange={handleCaptionChange}
      />
      <Button type="submit" variant="contained" color="primary" className={classes.submitButton}>
        Create Post
      </Button>
    </form>
  );
};

export default CreatePost;
