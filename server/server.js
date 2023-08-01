const express = require('express');
require('dotenv').config();
const path = require('path');
  const cors = require('cors');
const socket = require('socket.io');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
// testing



app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());                           /* This is new and allows JSON Objects to be posted */
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/posts', express.static(path.join(__dirname, 'posts')));

   /* This is new and allows JSON Objects with strings and arrays*/
require('./config/mongoose.config');    /* This is new */

require('./routes/user.routes')(app)
require('./routes/post.routes')(app)
const server = app.listen(8000, () => {
    console.log("Listening at Port 8000")
})

const io = socket(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        allowedHeaders: ['*'],
        credentials: true,
    }
})

io.on('connection', (socket) => {
  // ketu nis lidhja e streamit
  console.log('New client connected');
  socket.on("toServer", data => {
    // send a message with "data" to ALL clients EXCEPT for the one that emitted the
    //     "event_from_client" event
    console.log("ne server therritet  toServer");
    io.emit("toClient", data);
});

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

