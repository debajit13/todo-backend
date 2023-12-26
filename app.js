require('dotenv').config();
require('./config/database').connect;
const express = require('express');
const app = express();
const YAML = require('yaml');
const swaggerUI = require('swagger-ui-express');
const fs = require('fs');
const cors = require('cors');
const file = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);
const Todo = require('./models/todo');

app.use(express.json());
app.use(cors());
// route to swagger api documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// route to homepage of our api
app.get('/api/v1/', (req, res) => {
  return res.status(200).json({
    error: false,
    message: 'Welcome to todo backend',
  });
});

// route to get all the todos
app.get('/api/v1/todos', async (req, res) => {
  const todos = await Todo.find({});

  return res.status(200).json({
    error: false,
    message: 'All todos retrived successfully!',
    todos,
  });
});

// route to add new todo
app.post('/api/v1/todos', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!(title && description)) {
      return res.status(400).json({
        error: true,
        message: 'title and description are required fields!',
      });
    }

    const newTodo = await Todo.create({
      title,
      description,
      isDone: false,
    });
    return res.status(201).json({
      error: false,
      message: 'todo added successfully!',
      todo: newTodo,
    });
  } catch (error) {
    console.error(error);
  }
});

// route to delete a todo by Id
app.delete('/api/v1/todos', async (req, res) => {
  const _id = req.query.id;

  if (!_id) {
    return res.status(400).json({
      error: true,
      message: "'id' is a required field!",
    });
  }

  const status = await Todo.deleteOne({
    _id,
  });

  if (status?.deletedCount === 0) {
    return res.status(404).json({
      error: true,
      message: 'todo not found!',
    });
  }

  return res.status(200).json({
    error: false,
    message: 'todo deleted successfully!',
    status,
  });
});

// route to update a todo by Id
app.put('/api/v1/todos', async (req, res) => {
  const _id = req.query.id;
  const { title, description, isDone } = req.body;

  if (!_id) {
    return res.status(400).json({
      error: true,
      message: "'id' is a required field!",
    });
  } else if (!(title && description && isDone)) {
    return res.status(400).json({
      error: true,
      message: 'title and description are required fields!',
    });
  }

  const status = await Todo.findByIdAndUpdate(_id, {
    title,
    description,
    isDone,
  });

  return res.status(200).json({
    error: false,
    message: 'todo updated successfully!',
  });
});

module.exports = app;
