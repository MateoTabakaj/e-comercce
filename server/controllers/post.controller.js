const Post = require("../models/post.model");
const User = require("../models/user.model")
const multer = require('multer');
const path = require('path');

// Configure Multer storage and file naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'posts'); // Set the destination folder where images will be stored
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filePath = 'http://localhost:8000/posts/' + uniqueSuffix + ext;
    cb(null, uniqueSuffix + ext); // Rename the file with a unique name
  },
});

// Set up the Multer middleware
const upload = multer({ storage });

module.exports = {
  createPost: (req, res) => {
    const { id } = req.params;
    const { caption, photo } = req.body;

    // Process file upload
    upload.single('photo')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      // File upload successful, retrieve file path
      const filePath = req.file ? 'http://localhost:8000/posts/' + req.file.filename : null;

      // Create the post with the uploaded photo
      User.findById(id)
        .then((user) => {
          if (!user) {
            return res.status(400).json({ message: "User not found" });
          }

          // Create a new post
          Post.create({
            caption,
            photo: filePath, // Save the complete file path in the post model
            user: user._id, // Set the user ID for the post
          })
            .then((post) => {
              return res.status(200).json({ message: "Post created successfully", post });
            })
            .catch((err) => {
              console.log("Error creating post:", err);
              return res.status(400).json(err);
            });
        })
        .catch((err) => {
          console.error("Error finding user:", err);
          return res.status(500).json({ message: "Internal server error" });
        });
    });
},
getPosts: (req, res) => {
  Post.find()
    .populate("user", ["firstName", "lastName"]) // Populate the user field with firstName and lastName
    .then((err, posts) => {
      if (err) {
        console.log("Error getting posts:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      return res.status(200).json({ posts });
    });
},

  likePost: (req, res) => {
    const { postId, userId } = req.body;

    Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } }, // Add userId to the likes array if not already present
      { new: true }
    )
      .then((post) => {
        return res.status(200).json({ message: "Post liked successfully", post });
      })
      .catch((err) => {
        console.error("Error liking post:", err);
        return res.status(500).json({ message: "Internal server error" });
      });
  },

  commentPost: (req, res) => {
    const { postId, userId, text } = req.body;

    Post.findByIdAndUpdate(
      postId,
      { $push: { comments: { user: userId, text: text } } },
      { new: true }
    )
      .then((post) => {
        return res.status(200).json({ message: "Comment added successfully", post });
      })
      .catch((err) => {
        console.error("Error commenting on post:", err);
        return res.status(500).json({ message: "Internal server error" });
      });
  },

  savePost: (req, res) => {
    const { postId, userId } = req.body;

    User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: postId } }, // Add postId to the favorites array if not already present
      { new: true }
    )
      .then((user) => {
        return res.status(200).json({ message: "Post saved as favorite successfully", user });
      })
      .catch((err) => {
        console.error("Error saving post as favorite:", err);
        return res.status(500).json({ message: "Internal server error" });
      });
  },
};
