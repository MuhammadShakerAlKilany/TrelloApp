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
const tryCatchErr_1 = __importDefault(require("./tryCatchErr"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const guard = (0, tryCatchErr_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) {
        req.cookies.token = req.headers.authorization;
        token = req.headers.authorization;
    }
    try {
            console.log(token)

        const tokenData = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        if (!tokenData)
            return res.status(401).json({ message: "you are logOut" });
    }
    catch (error) {
        console.log(error);
        res
            .clearCookie("token")
            .status(400)
            .json({ message: "err in jwt verify you are logOut" });
        return;
    }
    next();
}));
exports.default = guard;
