"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    let token = req.header('Authorization');
    token = token && token.replace('Bearer ', '');
    if (!token) {
        return res.status(400).json({
            error: true,
            message: 'token is required!',
        });
    }
    try {
        const decode = jsonwebtoken_1.default.verify(token, process.env.SECRET || 'TodoBackend');
        if ('user' in req) {
            req['user'] = decode;
        }
    }
    catch (error) {
        return res.status(401).json({
            error: true,
            message: 'Invalid token',
        });
    }
    return next();
};
exports.default = auth;
