"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdSchema = exports.userJoiSchemaUpdateIdInBody = exports.userJoiSchemaUpdate = exports.userJoiSchemaLogeIn = exports.userJoiSchemaSignUp = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userJoiSchemaSignUp = joi_1.default.object({
    userName: joi_1.default.string().min(5).max(30).required(),
    email: joi_1.default.string().email({ tlds: { allow: ["com", "net", "lol"] } }).required(),
    password: joi_1.default.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).required(),
    age: joi_1.default.number().min(18).max(60).required(),
    gender: joi_1.default.string().valid("male", "female").required(),
    phone: joi_1.default.string().pattern(/^0(10|11|12|15)\d{8}$/),
});
exports.userJoiSchemaLogeIn = joi_1.default.object({
    email: joi_1.default.string().email({ tlds: { allow: ["com", "net", "lol"] } }).required(),
    password: joi_1.default.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).required(),
});
exports.userJoiSchemaUpdate = joi_1.default.object({
    userName: joi_1.default.string().min(5).max(30),
    age: joi_1.default.number().min(18).max(60),
    password: joi_1.default.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
});
exports.userJoiSchemaUpdateIdInBody = joi_1.default.object({
    id: joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/),
    userName: joi_1.default.string().min(5).max(30),
    age: joi_1.default.number().min(18).max(60),
    password: joi_1.default.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
});
exports.userIdSchema = joi_1.default.object({
    id: joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
});
