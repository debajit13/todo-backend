"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const todoController_1 = require("../controllers/todoController");
const auth_1 = __importDefault(require("../middleware/auth"));
// route to homepage of our api
router.get('/', todoController_1.home);
// route to get all the todos
router.get('/todos', auth_1.default, todoController_1.getTodos);
// route to add new todo
router.post('/todos', auth_1.default, todoController_1.addTodo);
// route to update a todo by Id
router.put('/todos', auth_1.default, todoController_1.editTodo);
// route to delete a todo by Id
router.delete('/todos', auth_1.default, todoController_1.deleteTodo);
exports.default = router;
