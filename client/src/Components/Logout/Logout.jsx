import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await axios.post('http://localhost:8000/api/logout', {}, { withCredentials: true });
        navigate('/login');
      } catch (error) {
        console.error('Error:', error);
      }
    };

    handleLogout();
  }, []);

  return <button >Logout</button>;
}

export default Logout;
