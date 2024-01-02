"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const MONGO_URL = process.env.MONGO_URL || '';
const connect = mongoose_1.default
    .connect(MONGO_URL)
    .then(() => {
    console.log('DB connected Successfully!');
})
    .catch((error) => {
    console.error('DB connection failed!');
    console.error(error);
    process.exit(1);
});
exports.default = connect;
