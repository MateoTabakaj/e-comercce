// UserSearch.js
import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';
import axios from 'axios';
import UserList from './UserList'; // Import the UserList component
import { Link } from 'react-router-dom';

const UserSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user/search', { withCredentials: true });
      setSearchResults(response.data.users);
    } catch (error) {
      console.log('Error searching users:', error);
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={8}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search users by username"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </Grid>
      {searchResults.length > 0 && (
        <UserList searchResults={searchResults} /> 
      )}
    </Grid>
  );
};

export default UserSearch;
