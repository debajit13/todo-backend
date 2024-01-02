import mongoose, { Schema } from 'mongoose';

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

const todoModel = mongoose.model('todo', todoSchema);
export default todoModel;
