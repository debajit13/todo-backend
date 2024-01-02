import dotenv from 'dotenv';
import connect from './config/database';
connect;
import express, { Express, Request, Response } from 'express';
const app: Express = express();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import YAML from 'yaml';
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
const swaggerPath = path.resolve(__dirname, '../swagger.yaml');
const file: string = fs.readFileSync(swaggerPath, 'utf8');
const swaggerDocument = YAML.parse(file);
import Todo from './models/todo';
import User from './models/user';
import auth from './middleware/auth';

dotenv.config();
app.use(express.json());
app.use(cors());
// route to swagger api documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// route to homepage of our api
app.get('/api/v1/', (req: Request, res: Response) => {
  return res.status(200).json({
    error: false,
    message: 'Welcome to todo backend',
  });
});

// route to register
app.post('/api/v1/register', async (req: Request, res: Response) => {
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

    const encryptedPassword: string = await bcrypt.hash(password, 10);

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
        process.env.SECRET || 'Backend-ToDo',
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
app.post('/api/v1/login', async (req: Request, res: Response) => {
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

    if (
      user &&
      user?.password &&
      (await bcrypt.compare(password, user?.password))
    ) {
      const token = jwt.sign(
        {
          user_id: user._id,
          email,
        },
        process.env.SECRET || 'Backend-ToDo',
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
app.get('/api/v1/todos', auth, async (req: Request, res: Response) => {
  const todos = await Todo.find({});

  return res.status(200).json({
    error: false,
    message: 'All todos retrived successfully!',
    todos,
  });
});

// route to add new todo
app.post('/api/v1/todos', auth, async (req: Request, res: Response) => {
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
app.delete('/api/v1/todos', auth, async (req: Request, res: Response) => {
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
app.put('/api/v1/todos', auth, async (req: Request, res: Response) => {
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

export default app;
