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
exports.googleLogin = exports.logout = exports.deleteUser = exports.updateUser = exports.softDelete = exports.Verifi = exports.login = exports.signUp = void 0;
const tryCatchErr_1 = __importDefault(require("../middleware/tryCatchErr"));
const user_dao_1 = __importDefault(require("../dao/user.dao"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const userDao = new user_dao_1.default();
exports.signUp = (0, tryCatchErr_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    const newUser = yield userDao.addUser(user);
    // console.log({...newUser})
    const data = Object.create(newUser);
    data.password = undefined;
    const token = jsonwebtoken_1.default.sign(data.toJSON(), process.env.SECRET_KEY);
    yield sendVerified(newUser.email, token);
    res
        .status(201)
        .json({
        message: `signUp succass check your email ${data.email} for verified`,
        data,
    });
}));
exports.login = (0, tryCatchErr_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userFind = yield userDao.findUserByEmail(req.body.email);
    if (!userFind)
        return res
            .status(404)
            .json({ message: `Not found user with email ${req.body.email}` });
    if (userFind) {
        if (userFind === null || userFind === void 0 ? void 0 : userFind.softDelete)
            return res.json({ message: `user is soft Delete` });
        if (!(userFind === null || userFind === void 0 ? void 0 : userFind.isVerified))
            return res.json({ message: `email ${userFind === null || userFind === void 0 ? void 0 : userFind.email} not Verified` });
        const compared = yield bcrypt_1.default.compare(req.body.password, userFind.password);
        if (compared) {
            const data = userFind;
            data.password = undefined;
            const token = jsonwebtoken_1.default.sign(data.toJSON(), process.env.SECRET_KEY);
            return res.cookie("token", token).json({ message: "user login", data, token: token });
        }
        else {
            return res.json({ message: "password is rong" });
        }
    }
    console.log(" after log in");
}));
exports.Verifi = (0, tryCatchErr_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = jsonwebtoken_1.default.verify(req.params.token, process.env.SECRET_KEY);
    const userVerifie = yield userDao.verifie(user._id, true);
    const data = userVerifie;
    data.password = undefined;
    const tokenData = jsonwebtoken_1.default.sign(data.toJSON(), process.env.SECRET_KEY);
    res.cookie("token", tokenData).json({ message: "email is verify", data });
}));
exports.softDelete = (0, tryCatchErr_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    const tokenData = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
    let isDelete;
    isDelete = req.method == "DELETE";
    const user = yield userDao.softDeleteUser(tokenData._id, isDelete);
    const data = user;
    data.password = undefined;
    res.clearCookie("token").json({ message: "user is soft Delete", data });
}));
exports.updateUser = (0, tryCatchErr_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    const user = req.body;
    let id;
    if (!(user.age || user.password || user.userName))
        return res
            .status(404)
            .json({ message: "no age||password||userName to update " });
    if ((_b = req.params) === null || _b === void 0 ? void 0 : _b.id) {
        id = (_c = req.params) === null || _c === void 0 ? void 0 : _c.id;
    }
    else {
        const token = (_d = req.cookies) === null || _d === void 0 ? void 0 : _d.token;
        if (!token)
            return res.status(403).json({ message: "you are logOut" });
        const tokenData = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        id = tokenData._id;
    }
    // console.log(id)
    const userUpdate = (yield userDao.updateUser(id, user));
    //   console.log(userUpdate)
    if (!userUpdate)
        return res.status(403).json({ message: "you are logOut " });
    userUpdate.password = undefined;
    const token = jsonwebtoken_1.default.sign(userUpdate.toJSON(), process.env.SECRET_KEY);
    return res
        .cookie("token", token)
        .json({ message: "Updated", data: userUpdate });
}));
exports.deleteUser = (0, tryCatchErr_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g;
    let id;
    if ((_e = req.params) === null || _e === void 0 ? void 0 : _e.id) {
        id = (_f = req.params) === null || _f === void 0 ? void 0 : _f.id;
    }
    else {
        const token = (_g = req.cookies) === null || _g === void 0 ? void 0 : _g.token;
        if (!token)
            return res.status(403).json({ message: "you are logOut" });
        const tokenData = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        id = tokenData._id;
    }
    const userDeleted = (yield userDao.deleteUserById(id));
    if (userDeleted)
        return res.status(404).json({ message: "not found user" });
    res.json({ message: "Deleted", data: userDeleted });
}));
exports.logout = (0, tryCatchErr_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token").json({ message: "you are logOut" });
}));
function sendVerified(email, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.PASS_EMAIL,
            },
        });
        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: "Sending Email using Node.js",
            text: "That was easy!",
            html: `<a href='${process.env.URL}/api/v1/users/verifie/${token}'>Verifie Email</a>`,
        };
        const info = yield transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    });
}
const google_auth_library_1 = require("google-auth-library");
exports.googleLogin = (0, tryCatchErr_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenGoogle = req.body.credential;
    const user = yield verifyGoogleToken(tokenGoogle);
    if (user) {
        const userFind = yield userDao.findUserByEmail(user === null || user === void 0 ? void 0 : user.email);
        if (userFind) {
            userFind.password = undefined;
            const token = jsonwebtoken_1.default.sign(userFind.toJSON(), process.env.SECRET_KEY);
            return res.cookie("token", token).json({ message: "user login", data: userFind, token: token });
        }
        else {
            const tokenGoogle = req.body.credential;
            const user = yield verifyGoogleToken(tokenGoogle);
            const newUser = yield userDao.addUser(user);
            const data = Object.create(newUser);
            data.password = undefined;
            const token = jsonwebtoken_1.default.sign(data.toJSON(), process.env.SECRET_KEY);
            res.status(201)
                .json({
                message: ``,
                data, token
            });
        }
    }
}));
function verifyGoogleToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const clientId = '880761381934-16eu08t3on4omt7mhtpspnds25quusdj.apps.googleusercontent.com';
        const client = new google_auth_library_1.OAuth2Client(clientId);
        try {
            const ticket = yield client.verifyIdToken({
                idToken: token,
                audience: clientId,
            });
            const payload = ticket.getPayload();
            const user = {
                userName: payload.name,
                email: payload.email,
                password: payload.jti,
                age: 0,
                gender: "male",
                isVerified: true,
            };
            return user;
        }
        catch (error) {
            console.error('Error verifying Google token:', error);
        }
    });
}
