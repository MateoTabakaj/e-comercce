import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from the backend
    axios.get('http://localhost:8000/', { withCredentials: true })
      .then((response) => {
        // console.log(response)
        if (response.status !== 200) {
          navigate('/login');
        }
        setLoading(false);
      })
      .catch((error) => {
        // console.log('Error:', error);
        if (error.status !== 200) {
          navigate('/login');
        }
        setLoading(false);
        // error.response.status === 401 ? navigate("/login") : console.log(error)
      });
  }, []);

  return (
    <div>
    <h1>This is home</h1>
    </div>
  );
};

export default Home;
