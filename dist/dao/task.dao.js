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
const task_module_1 = __importDefault(require("../modules/task.module"));
class TaskDao {
    addTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield task_module_1.default.create(task);
        });
    }
    updateTask(id, userId, task) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield task_module_1.default.findOneAndUpdate({ _id: id, userId }, task, { new: true });
        });
    }
    deleteTask(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield task_module_1.default.findOneAndDelete({ _id: id, userId });
        });
    }
    getAllTask() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield task_module_1.default.find();
        });
    }
    getAllTaskWithUserData() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield task_module_1.default.find().populate([{ path: 'userId', select: '-password' }, { path: "assignTo", select: '-password' }]);
        });
    }
    getAllTaskNotDoneAfterDeadline() {
        return __awaiter(this, void 0, void 0, function* () {
            const know = new Date();
            return yield task_module_1.default.find({ deadline: { $lt: know }, status: { $ne: "done" } });
        });
    }
}
exports.default = TaskDao;
