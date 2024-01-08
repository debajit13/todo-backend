"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const database_1 = __importDefault(require("./config/database"));
database_1.default;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const yaml_1 = __importDefault(require("yaml"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const swaggerPath = path_1.default.resolve(__dirname, '../swagger.yaml');
const file = fs_1.default.readFileSync(swaggerPath, 'utf8');
const swaggerDocument = yaml_1.default.parse(file);
const todo_1 = __importDefault(require("./routes/todo"));
const auth_1 = __importDefault(require("./routes/auth"));
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('tiny'));
// route to swagger api documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// todo routes
app.use('/api/v1', todo_1.default);
// auth routes
app.use('/api/v1', auth_1.default);
exports.default = app;
