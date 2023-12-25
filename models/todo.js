const mongoose = require('mongoose');
const { Schema } = mongoose;

const todoSchema = new Schema({
  title: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  isDone: {
    type: Boolean,
  },
});

module.exports = mongoose.model('todo', todoSchema);
