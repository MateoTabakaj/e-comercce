import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography } from '@mui/material';
import {makeStyles} from '@mui/styles'
import axios from 'axios';
import Posts from '../Posts';

const useStyles = makeStyles((theme) => ({
  profileCard: {
    background: '#141E30',
    color: '#FFFFFF',
    padding: theme.spacing(2),
  },
  avatar: {
    width: '150px',
    height: '70px',
    marginBottom: theme.spacing(2),
  },
}));

const Profile = () => {
  const classes = useStyles();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [id,setId]=useState('')

  useEffect(() => {
    // Fetch user data from the backend
    axios.get('http://localhost:8000/api/user', { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
        console.log(response.data.user);
        setId(response.data.user._id)
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
        // error.response.status === 401 ? navigate("/login") : console.log(error)
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user found.</div>;
  }

  return (
    <Card className={classes.profileCard}>
      <CardContent>
        <Typography variant="h5" component="div">
          User Info
        </Typography>
        <img className={classes.avatar} src={user.avatar} alt="Profile Avatar" />
        <Typography variant="body1">
          Name: {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="body1">Email: {user.email}</Typography>
        <Typography variant="body1">Birthday: {user.birthday}</Typography>
        {/* Display other user information here */}
      </CardContent>
      <Posts id={id}/>
    </Card>
  );
};

export default Profile;
