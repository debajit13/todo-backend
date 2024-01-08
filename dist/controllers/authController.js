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
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            return res.status(200).json({
                error: false,
                message: 'User loggedIn successfully!',
                user,
            });
        }
        return res.status(401).json({
            error: true,
            message: 'Password is wrong!',
        });
    }
    catch (error) {
        console.error(error);
    }
});
exports.login = login;
