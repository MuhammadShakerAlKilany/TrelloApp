"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controller/user.controller");
const joiValidator_1 = require("../middleware/joiValidator");
const user_joi_1 = require("../joi/user.joi");
const guard_1 = __importDefault(require("../middleware/guard"));
const task_joi_1 = require("../joi/task.joi");
const router = (0, express_1.Router)();
router.post("/signUp", (0, joiValidator_1.joiValidatorBody)(user_joi_1.userJoiSchemaSignUp), user_controller_1.signUp);
router.post("/login", (0, joiValidator_1.joiValidatorBody)(user_joi_1.userJoiSchemaLogeIn), user_controller_1.login);
router.get("/verifie/:token", user_controller_1.Verifi);
router.route("/softDelete").all(guard_1.default).delete(user_controller_1.softDelete).get(user_controller_1.softDelete);
router
    .route("/user")
    .all(guard_1.default)
    .patch((0, joiValidator_1.joiValidatorBody)(user_joi_1.userJoiSchemaUpdateIdInBody), user_controller_1.updateUser)
    .delete(user_controller_1.deleteUser);
router
    .route("/user/:id")
    .all(guard_1.default, (0, joiValidator_1.joiValidatorParams)(task_joi_1.taskIdSchema))
    .patch((0, joiValidator_1.joiValidatorBody)(user_joi_1.userJoiSchemaUpdate), user_controller_1.updateUser)
    .delete(user_controller_1.deleteUser);
router.get("/logout", guard_1.default, user_controller_1.logout);
exports.default = router;
