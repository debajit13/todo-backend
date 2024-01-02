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
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
database_1.default;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const yaml_1 = __importDefault(require("yaml"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const swaggerPath = path_1.default.resolve(__dirname, '../swagger.yaml');
const file = fs_1.default.readFileSync(swaggerPath, 'utf8');
const swaggerDocument = yaml_1.default.parse(file);
const todo_1 = __importDefault(require("./models/todo"));
const user_1 = __importDefault(require("./models/user"));
const auth_1 = __importDefault(require("./middleware/auth"));
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// route to swagger api documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// route to homepage of our api
app.get('/api/v1/', (req, res) => {
    return res.status(200).json({
        error: false,
        message: 'Welcome to todo backend',
    });
});
// route to register
app.post('/api/v1/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!(firstName && lastName && email && password)) {
            return res.status(400).json({
                error: true,
                message: 'firstName, lastName, email and password are required fields!',
            });
        }
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                error: true,
                message: 'User is already existed!',
            });
        }
        const encryptedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield user_1.default.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });
        if (user) {
            const token = jsonwebtoken_1.default.sign({
                user_id: user._id,
                email,
            }, process.env.SECRET || 'Backend-ToDo', {
                expiresIn: '2h',
            });
            user.password = undefined;
            user.token = token;
        }
        return res.status(200).json({
            error: false,
            message: 'User created successfully!',
            user,
        });
    }
    catch (error) {
        console.error(error);
    }
}));
// route to login
app.post('/api/v1/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).json({
                error: true,
                message: 'email and password are required fields!',
            });
        }
        const user = yield user_1.default.findOne({
            email: email.toLowerCase(),
        });
        if (!user) {
            return res.status(400).json({
                error: true,
                message: "User hasn't registered yet!",
            });
        }
        if (user &&
            (user === null || user === void 0 ? void 0 : user.password) &&
            (yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password))) {
            const token = jsonwebtoken_1.default.sign({
                user_id: user._id,
                email,
            }, process.env.SECRET || 'Backend-ToDo', {
                expiresIn: '2h',
            });
            user.password = undefined;
            user.token = token;
        }
        return res.status(200).json({
            error: false,
            message: 'User loggedIn successfully!',
            user,
        });
    }
    catch (error) {
        console.error(error);
    }
}));
// route to get all the todos
app.get('/api/v1/todos', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todos = yield todo_1.default.find({});
    return res.status(200).json({
        error: false,
        message: 'All todos retrived successfully!',
        todos,
    });
}));
// route to add new todo
app.post('/api/v1/todos', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
// route to delete a todo by Id
app.delete('/api/v1/todos', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
// route to update a todo by Id
app.put('/api/v1/todos', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
exports.default = app;
