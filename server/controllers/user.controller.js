const User = require("../models/user.model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

// Configure Multer storage and file naming
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Set the destination folder where images will be stored
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filePath = 'http://localhost:8000/uploads/' + uniqueSuffix + ext;
        cb(null, uniqueSuffix + ext); // Rename the file with a unique name
    },
});

// Set up the Multer middleware
const upload = multer({ storage });

module.exports = {
    getUser: (req, res) => {
        const token = req.cookies.usertoken;
        if (!token) {
            return res.status(401).json({ message: 'User not logged in' });
        }

        try {
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const userId = decodedToken.id;

            User.findById(userId)
                .then((user) => {
                    if (!user) {
                        return res.status(404).json({ message: 'User not found' });
                    }

                    // User found, include the avatar link in the response
                    const userData = { ...user._doc, avatar: user.avatar };
                    return res.json({ user: userData });
                })
                .catch((err) => {
                    console.error('Error finding user:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                });
        } catch (err) {
            console.error('Error decoding token:', err);
            return res.status(401).json({ message: 'Invalid token' });
        }
    },

    register: (req, res) => {
        const { email, username } = req.body;
        console.log(req.body)
        // Check if a user with the same email or username already exists
        User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        })
            .then(existingUser => {
                if (existingUser) {
                    // User with the same email or username already exists
                    return res.status(400).json({ errors: { email: { message: 'User with the same email or username already exists' } } });
                }

                // Process file upload
                upload.single('avatar')(req, res, (err) => {
                    if (err) {
                        return res.status(400).json({ error: err.message });
                    }

                    // File upload successful, retrieve file path
                    const filePath = req.file ? 'http://localhost:8000/uploads/' + req.file.filename : 'http://localhost:8000/uploads/profilepic.png';

                    User.create({
                        ...req.body,
                        avatar: filePath, // Save the complete file path in the user model
                    })
                        .then((user) => {
                            const userToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

                            return res.cookie('usertoken', userToken, { httpOnly: true })
                                .json({ msg: 'success!', user });
                        })
                        .catch((err) => {
                            console.log(err);
                            return res.status(400).json(err);
                        });
                });
            })
            .catch(err => {
                console.error('Error finding user:', err);
                return res.status(500).json({ message: 'Internal server error' });
            });
    },

    logout: (req, res) => {
        res.clearCookie('usertoken');
        res.sendStatus(200);
    },

    login: async (req, res) => {
        const user = await User.findOne({ email: req.body.email });

        if (user === null) {
            // email not found in users collection
            return res
                .status(400)
                .json({ errors: { email: { message: 'There Is no user with this email' } } });
        }

        // if we made it this far, we found a user with this email address
        // let's compare the supplied password to the hashed password in the database
        const correctPassword = await bcrypt.compare(req.body.password, user.password);

        if (!correctPassword) {
            // password wasn't a match!
            return res
                .status(400)
                .json({ errors: { password: { message: 'The password is incorrect' } } });
        }

        // if we made it this far, the password was correct
        const userToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
        // note that the response object allows chained calls to cookie and json
        res.cookie('usertoken', userToken, {
            httpOnly: true,
        }).json({ msg: 'success!', token: userToken });
    },
};
