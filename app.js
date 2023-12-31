require('dotenv').config();
require('./config/database').connect;
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const YAML = require('yaml');
const swaggerUI = require('swagger-ui-express');
const fs = require('fs');
const cors = require('cors');
const file = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);
const Todo = require('./models/todo');
const User = require('./models/user');
const auth = require('./middleware/auth');

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

// route to register
app.post('/api/v1/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!(firstName && lastName && email && password)) {
      return res.status(400).json({
        error: true,
        message: 'firstName, lastName, email and password are required fields!',
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: 'User is already existed!',
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    if (user) {
      const token = jwt.sign(
        {
          user_id: user._id,
          email,
        },
        process.env.SECRET,
        {
          expiresIn: '2h',
        }
      );
      user.password = undefined;
      user.token = token;
    }

    return res.status(200).json({
      error: false,
      message: 'User created successfully!',
      user,
    });
  } catch (error) {
    console.error(error);
  }
});

// route to login
app.post('/api/v1/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({
        error: true,
        message: 'email and password are required fields!',
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "User hasn't registered yet!",
      });
    }

    if (user && bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          user_id: user._id,
          email,
        },
        process.env.SECRET,
        {
          expiresIn: '2h',
        }
      );
      user.password = undefined;
      user.token = token;
    }

    return res.status(200).json({
      error: false,
      message: 'User loggedIn successfully!',
      user,
    });
  } catch (error) {
    console.error(error);
  }
});

// route to get all the todos
app.get('/api/v1/todos', auth, async (req, res) => {
  const todos = await Todo.find({});

  return res.status(200).json({
    error: false,
    message: 'All todos retrived successfully!',
    todos,
  });
});

// route to add new todo
app.post('/api/v1/todos', auth, async (req, res) => {
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
app.delete('/api/v1/todos', auth, async (req, res) => {
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
app.put('/api/v1/todos', auth, async (req, res) => {
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
