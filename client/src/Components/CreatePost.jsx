import React, { useState } from 'react';
import { TextField, Button, Input } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.pathname.split('/')[2];

  const handlePhotoChange = (event) => {
    setPhoto(event.target.files[0]);
  };

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Client-side validation
    if (!caption) {
      setValidation({ caption: { kind: 'required', message: 'Caption is required.' } });
      return;
    }

    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('photo', photo);

    axios
      .post(`http://localhost:8000/api/posts/${userId}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response.data);
        navigate(`/profile/${userId}`);
        // Handle the response from the server
      })
      .catch((error) => {
        console.log(error.response.data.errors);
        setValidation(error.response.data.errors);
      });
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit} encType="multipart/form-data">
      <Input
        accept="image/*"
        onChange={handlePhotoChange}
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
        label="Caption"
        variant="outlined"
        value={caption}
        onChange={handleCaptionChange}
        // error={!!validation.caption}
        // helperText={validation.caption && validation.caption.message}
      />
      <Button type="submit" variant="contained" color="primary" className={classes.submitButton}>
        Create Post
      </Button>
    </form>
  );
};

export default CreatePost;
