const Users = require('../controllers/user.controller');
const { authenticate } = require('../config/jwt.config');
module.exports = (app) => {
    app.post("/api/register", Users.register);
    app.post("/api/login", Users.login);
    app.post("/api/logout", authenticate, Users.logout);
    // For Single image upload
    // this route now has to be authenticated
    app.get("/api/user",authenticate, Users.getUser)
    app.get('/',authenticate, (req, res) => { 
        res.send("Server Is On"); 
      });
      app.get('/api', (req, res) => { 
        res.send("THIS IS THE API OF THE SERVER"); 
      });
      
}