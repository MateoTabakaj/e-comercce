const Users = require('../controllers/user.controller');
const { authenticate } = require('../config/jwt.config');

module.exports = (app) => {
  app.post("/api/register", Users.register);
  app.post("/api/login", Users.login);
  app.post("/api/logout", authenticate, Users.logout);
  app.get("/api/user/search", Users.searchUsersByName);
  // Protected route: Get user information
  app.get("/api/user", authenticate, Users.getUser);
  app.post('/users/:userId/follow',authenticate, Users.followUser)
  // Example routes
  app.get('/', (req, res) => {
    res.send("Server Is On");
  });

  app.get('/api', (req, res) => {
    res.send("THIS IS THE API OF THE SERVER");
  });
};
