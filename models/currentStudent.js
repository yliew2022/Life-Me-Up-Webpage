const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const currentStudentSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  zNumber: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('CurrentStudent', currentStudentSchema);