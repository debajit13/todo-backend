import { Request, Response } from 'express';
import Todo from '../models/todo';

const home = (req: Request, res: Response) => {
  return res.status(200).json({
    error: false,
    message: 'Welcome to todo backend',
  });
};

const getTodos = async (req: Request, res: Response) => {
  const todos = await Todo.find({});

  return res.status(200).json({
    error: false,
    message: 'All todos retrived successfully!',
    todos,
  });
};

const addTodo = async (req: Request, res: Response) => {
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
};

const editTodo = async (req: Request, res: Response) => {
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
};

const deleteTodo = async (req: Request, res: Response) => {
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
};

export { home, getTodos, addTodo, editTodo, deleteTodo };
