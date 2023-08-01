// Posts.jsx
import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Avatar, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import { Favorite, Comment, Bookmark } from '@mui/icons-material';
import axios from 'axios';
import CommentForm from './CommentForm'; // Import the CommentForm component

const useStyles = makeStyles((theme) => ({
  postCard: {
    marginBottom: theme.spacing(2),
    height: 400,
    cursor: 'pointer',
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: '50%',
  },
  postImage: {
    objectFit: 'cover',
    width: '80%',
    height: '80%',
  },
  iconButton: {
    padding: theme.spacing(0.5), // Reduce the padding to 0.5 times the default spacing (1px)
    marginLeft: theme.spacing(0.5),
  },
}));

const Posts = (props) => {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const id = props;
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/posts/${id}`, { withCredentials: true });
      setPosts(response.data.posts);
      console.log(response.data.posts)
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await axios.post('http://localhost:8000/api/posts/like', { postId }, { withCredentials: true });
      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            likes: response.data.post.likes,
          };
        }
        return post;
      });
      setPosts(updatedPosts);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentPost = async (postId, comment) => {
    try {
      const response = await axios.post('http://localhost:8000/api/posts/comment', { postId, text: comment }, { withCredentials: true });
      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            comments: response.data.post.comments,
          };
        }
        return post;
      });
      setPosts(updatedPosts);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  

  return (
    <div>
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post._id} onClick={() => handlePostClick(post)}>
            <Card className={classes.postCard}>
              <CardContent>
                {/* Display post information */}
                <Typography variant="body1" component="div" display="flex" alignItems="center">
                  <Avatar className={classes.avatar} src={post.user.avatar} alt="" />
                  <span>{post.user.userName}</span>
                </Typography>
                {post.photo && (
                  <img className={classes.postImage} src={post.photo} alt="Post" />
                )}
                <p>{post.caption}</p>
                <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={() => handleLikePost(post._id)}>
                    <FavoriteBorderOutlinedIcon />
                  </IconButton>
                  {post.likes.length}
                  <IconButton>
                    <Comment />
                  </IconButton>
                  {post.comments.length}
                  <IconButton>
                    <BookmarkBorderOutlinedIcon />
                  </IconButton>
                  {post.favorites.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        {selectedPost && (
          <div>
            <DialogTitle>
              <Avatar className={classes.avatar} src={selectedPost.user.avatar} alt="" />
              <span>{selectedPost.user.userName}</span>
            </DialogTitle>
            <DialogContent>
              <img className={classes.postImage} src={selectedPost.photo} alt="Post" />

              {/* Display post information */}
              <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => handleLikePost(selectedPost._id)}>
                  <FavoriteBorderOutlinedIcon />
                </IconButton>
                {selectedPost.likes.length}
                <IconButton>
                  <Comment />
                </IconButton>
                {selectedPost.comments.length}
                <IconButton>
                  <BookmarkBorderOutlinedIcon />
                </IconButton>
                {selectedPost.favorites.length}
              </Typography>
              <div>
                {selectedPost.comments.map((comment) => (
                  <div key={comment._id}>
                    <Typography variant="body1" component="div" display="flex" alignItems="center">
                      {comment.user.avatar && (
                        <Avatar className={classes.avatar} src={comment.user.avatar} alt="" />
                      )}
                      <span>{comment.user.userName}</span>
                    </Typography>
                    <Typography variant="body2">{comment.text}</Typography>
                  </div>
                ))}
              </div>
              <CommentForm postId={selectedPost._id} handleCommentAdd={handleCommentPost} />
            </DialogContent>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Posts;
