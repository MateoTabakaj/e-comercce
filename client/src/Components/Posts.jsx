import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography,} from '@mui/material';
import{ makeStyles } from '@mui/styles'
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  postCard: {
    marginBottom: theme.spacing(2),
  },
}));

const Posts = () => {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/posts', {withCredentials:true});
      setPosts(response.data.posts);
      setLoading(false);
    } catch (error) {
      console.log('Error:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (posts.length === 0) {
    return <div>No posts found.</div>;
  }

  return (
    <div>
      {posts.map((post) => (
        <Card key={post._id} className={classes.postCard}>
          <CardContent>
            <Typography variant="h5" component="div">
              {post.caption}
            </Typography>
            {post.photo && <img src={post.photo} alt="Post" />}
            <Typography variant="body1">
              User: {post.user.username}
            </Typography>
            {/* Display other post information here */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Posts;
