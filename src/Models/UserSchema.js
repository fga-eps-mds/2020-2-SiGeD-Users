const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true],
  },
  email: {
    type: String,
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
  }
});

module.exports = mongoose.model('User', userSchema);
