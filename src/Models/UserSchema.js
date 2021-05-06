const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true],
  },
  email: {
    type: String,
    unique: true,
    require: [true],
  },
  role: {
    type: String,
    require: [true],
  },
  sector: {
    type: String,
    require: [true],
  },
  pass: {
    type: String,
    require: [true],
  },
  createdAt: {
    type: Date,
    require: [true],
  },
  updatedAt: {
    type: Date,
    require: [true],
  },
  temporaryPassword: {
    type: Boolean,
    require: false,
    default: true,
  },
  photo: {
    name: {
      type: String,
      require: false,
    },
    size: {
      type: Number,
      require: false,
    },
    key: {
      type: String,
      require: false,
    },
  },
});

module.exports = mongoose.model('User', userSchema);
