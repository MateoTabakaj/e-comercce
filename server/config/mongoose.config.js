const secret = process.env.SECRET_KEY;
const mongoose = require('mongoose');
//This will create a database named "person" if one doesn't already exist (no need for mongo shell!):
mongoose.connect("mongodb://127.0.0.1:27017/SocialMedia", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log("Something went wrong when connecting to the database", err));
