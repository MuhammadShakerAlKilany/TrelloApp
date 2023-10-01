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
const user_module_1 = __importDefault(require("../modules/user.module"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserDao {
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_module_1.default.findById(id);
        });
    }
    verifie(id, isVerified) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_module_1.default.findByIdAndUpdate(id, { isVerified }, { new: true });
        });
    }
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_module_1.default.create(user);
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_module_1.default.findOne({ email });
        });
    }
    updateUser(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.password) {
                const salt = yield bcrypt_1.default.genSalt();
                const passwordHash = yield bcrypt_1.default.hash(user.password, salt);
                user.password = passwordHash;
            }
            return yield user_module_1.default.findByIdAndUpdate(id, user, { new: true });
        });
    }
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_module_1.default.findByIdAndDelete(id);
        });
    }
    softDeleteUser(id, softDelete) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_module_1.default.findByIdAndUpdate(id, { softDelete }, { new: true });
        });
    }
}
exports.default = UserDao;
