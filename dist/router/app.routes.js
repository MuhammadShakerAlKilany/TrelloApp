"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeApp = void 0;
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user.routes"));
const task_routes_1 = __importDefault(require("./task.routes"));
exports.routeApp = (0, express_1.Router)();
exports.routeApp.use("/users", user_routes_1.default);
exports.routeApp.use("/tasks", task_routes_1.default);
