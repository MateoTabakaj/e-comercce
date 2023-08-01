// UserList.js
import React from 'react';
import { Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';

const UserList = ({ searchResults }) => {
  // Check if searchResults is an array before using the map function
  if (!Array.isArray(searchResults)) {
    return null;
  }

  return (
    <>
      {searchResults.length > 0 && (
        <Grid item xs={12}>
          <Typography variant="h6">Search Results:</Typography>
          <Grid container spacing={2}>
            {searchResults.map((user) => (
              <Grid item key={user._id} xs={12} sm={6} md={4}>
                <Link to={`/user/${user._id}`} style={{ textDecoration: 'none' }}>
                  <Card>
                    <CardContent>
                      <Avatar src={user.avatar} alt="User Avatar" sx={{ width: 50, height: 50 }} />
                      <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        {user.userName}
                      </Typography>
                      <Typography variant="body2" component="div">
                        {user.followers.length} followers
                      </Typography>
                      <Typography variant="body2" component="div">
                        {user.following.length} following
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default UserList;
