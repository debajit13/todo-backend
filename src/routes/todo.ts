import { Router } from 'express';
const router = Router();
import {
  home,
  getTodos,
  addTodo,
  editTodo,
  deleteTodo,
} from '../controllers/todoController';
import auth from '../middleware/auth';

// route to homepage of our api
router.get('/', home);

// route to get all the todos
router.get('/todos', auth, getTodos);

// route to add new todo
router.post('/todos', auth, addTodo);

// route to update a todo by Id
router.put('/todos', auth, editTodo);

// route to delete a todo by Id
router.delete('/todos', auth, deleteTodo);

export default router;
