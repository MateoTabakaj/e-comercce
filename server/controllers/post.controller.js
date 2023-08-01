const Post = require("../models/post.model");
const User = require("../models/user.model");
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
    const { caption, photo } = req.body; // Added missing 'caption' variable

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
            caption: req.body.caption, // Use 'caption' variable instead of 'req.body.caption'
            photo: filePath, // Save the complete file path in the post model
            user: user._id, // Set the user ID for the post
          })
            .then((post) => {
              // Update the user's posts array
              User.findByIdAndUpdate(id, { $push: { posts: post._id } })
                .then(() => {
                  return res.status(200).json({ message: "Post created successfully", post });
                })
                .catch((err) => {
                  console.log("Error updating user's posts array:", err);
                  return res.status(500).json({ message: "Internal server error" });
                });
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

  getAllUserPostsById: (req, res) => {
    const { userId } = req.params;

    // Find the user by their ID
    User.find()
      .populate("posts") // Populate the 'posts' field with post documents
      .exec()
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // The 'posts' field of the user now contains an array of post documents
        const userPosts = user.posts;
        return res.status(200).json({ userPosts });
      })
      .catch((err) => {
        console.log("Error finding user posts:", err);
        return res.status(500).json({ message: "Internal server error" });
      });
  },

  likePost: (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
      $push: { likes: req.user._id }
    }, {
      new: true
    }).populate("postedBy", "_id userName Photo")
      .exec((err, result) => {
        if (err) {
          return res.status(422).json({ error: err })
        } else {
          res.json(result)
        }
      })
  },

  unlikePost: (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
      $pull: { likes: req.user._id }
    }, {
      new: true
    }).populate("postedBy", "_id userName Photo")
      .exec((err, result) => {
        if (err) {
          return res.status(422).json({ error: err })
        } else {
          res.json(result)
        }
      })
  },

  commentPost: (req, res) => {
    const comment = {
      comment: req.body.text,
      postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
      $push: { comments: comment }
    }, {
      new: true
    })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id userName Photo")
      .exec((err, result) => {
        if (err) {
          return res.status(422).json({ error: err })
        } else {
          res.json(result)
        }
      })
  },

  myFollowingPosts: (req, res) => {
    Post.find({ postedBy: { $in: req.user.following } })
      .populate("postedBy", "_id userName")
      .populate("comments.postedBy", "_id userName")
      .then(posts => {
        res.json(posts)
      })
      .catch(err => { console.log(err) })
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
