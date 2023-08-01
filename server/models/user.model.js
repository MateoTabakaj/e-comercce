const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  userName: {
    type: String,
    required: [true, "Username is required"],
    validate: {
      validator: (val) => /^[A-Za-z]\w{4,14}$/.test(val),
      message: "Username should contain 4 or more characters and should start with a letter",
    },
  },
  email: {
    type: String,
    // required: [true, "Email is required"], 
    // unique: [true, "This email is being used by another user"],
    validate: {
      validator: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      message: "Please enter a valid email",
    },
  },
  birthday: {
    type: Date, // Assuming the birthday is stored as a Date object
    required: [true, "Birthday is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be 8 characters or longer"],
  },
  avatar: {
    type: String,
    default: "http://localhost:8000/uploads/profilepic.png",
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, { timestamps: true });

UserSchema.virtual('confirmPassword')
  .get(function () {
    return this._confirmPassword;
  })
  .set(function (value) {
    this._confirmPassword = value;
  });

UserSchema.pre('validate', function (next) {
  if (this.password !== this.confirmPassword) {
    this.invalidate('confirmPassword', 'Password must match confirm password');
  }
  next();
});

UserSchema.pre('save', function (next) {
  bcrypt.hash(this.password, 10)
    .then(hash => {
      this.password = hash;
      next();
    });
});

module.exports = mongoose.model('User', UserSchema);
