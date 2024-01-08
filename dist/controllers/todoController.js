"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.editTodo = exports.addTodo = exports.getTodos = exports.home = void 0;
const todo_1 = __importDefault(require("../models/todo"));
const home = (req, res) => {
    return res.status(200).json({
        error: false,
        message: 'Welcome to todo backend',
    });
};
exports.home = home;
const getTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todos = yield todo_1.default.find({});
    return res.status(200).json({
        error: false,
        message: 'All todos retrived successfully!',
        todos,
    });
});
exports.getTodos = getTodos;
const addTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        if (!(title && description)) {
            return res.status(400).json({
                error: true,
                message: 'title and description are required fields!',
            });
        }
        const newTodo = yield todo_1.default.create({
            title,
            description,
            isDone: false,
        });
        return res.status(201).json({
            error: false,
            message: 'todo added successfully!',
            todo: newTodo,
        });
    }
    catch (error) {
        console.error(error);
    }
});
exports.addTodo = addTodo;
const editTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.query.id;
    const { title, description, isDone } = req.body;
    if (!_id) {
        return res.status(400).json({
            error: true,
            message: "'id' is a required field!",
        });
    }
    else if (!(title && description && isDone)) {
        return res.status(400).json({
            error: true,
            message: 'title and description are required fields!',
        });
    }
    const status = yield todo_1.default.findByIdAndUpdate(_id, {
        title,
        description,
        isDone,
    });
    return res.status(200).json({
        error: false,
        message: 'todo updated successfully!',
    });
});
exports.editTodo = editTodo;
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.query.id;
    if (!_id) {
        return res.status(400).json({
            error: true,
            message: "'id' is a required field!",
        });
    }
    const status = yield todo_1.default.deleteOne({
        _id,
    });
    if ((status === null || status === void 0 ? void 0 : status.deletedCount) === 0) {
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
exports.deleteTodo = deleteTodo;
