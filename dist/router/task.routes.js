"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guard_1 = __importDefault(require("../middleware/guard"));
const task_controller_1 = require("../controller/task.controller");
const task_joi_1 = require("../joi/task.joi");
const joiValidator_1 = require("../middleware/joiValidator");
const route = (0, express_1.Router)();
route.route("/task").all(guard_1.default).get(task_controller_1.getAllTask).post((0, joiValidator_1.joiValidatorBody)(task_joi_1.taskJoiSchema), task_controller_1.addTask);
route.route("/task/:id").all(guard_1.default, (0, joiValidator_1.joiValidatorParams)(task_joi_1.taskIdSchema)).patch((0, joiValidator_1.joiValidatorBody)(task_joi_1.taskJoiSchemaUpdate), task_controller_1.updateTask).delete(task_controller_1.deleteTask);
exports.default = route;
