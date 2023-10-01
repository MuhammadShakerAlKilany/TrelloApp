"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (error, req, res, next) => {
    if (error) {
        if (error.code == 11000)
            return res.status(400).json({ message: 'email is unique', error });
        if (error === null || error === void 0 ? void 0 : error.details) {
            const messageArr = error.details.map((err) => {
                return err.message;
            });
            return res.status(400).json({ message: messageArr });
        }
        if (error.statusCode == 400 && "body" in error)
            return res.status(400).json({ message: "req JSON maybe not correct" });
        if (error.name == "ValidationError")
            return res.status(404).json({ message: error.message });
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
};
exports.default = errorHandler;
