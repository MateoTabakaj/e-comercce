const Posts = require('../controllers/post.controller');
const { authenticate } = require('../config/jwt.config');

module.exports = (app) => {
  // Create a post
  app.post('/api/posts/:id', authenticate, Posts.createPost);
  // Find posts
  app.get('/api/posts', authenticate, Posts.getPosts)
  // Like a post
  app.post('/api/posts/like', authenticate, Posts.likePost);

  // Comment on a post
  app.post('/api/posts/comment', authenticate, Posts.commentPost);

  // Save a post as favorite
  app.post('/api/posts/save', authenticate, Posts.savePost);
};
