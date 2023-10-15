"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv");
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const app_routes_1 = require("./router/app.routes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT;
const mongodbURL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/TrelloApp";
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    console.log("Method:", req.method, "URL:", req.url);
    next();
});
app.get("/api/v1", (req, res) => {
    res.send("<h1> Hi to my API  I'm Muhammad shaker AlKilany </h1>");
});
app.use("/api/v1", app_routes_1.routeApp);
app.all("/*", (req, res) => {
    res.status(404).json({ message: `Not Found '${req.url}'` });
});
app.use(errorHandler_1.default);
app.listen(port, () => {
    console.log(`server run in http://127.0.0.1:${port}/api/v1 `);
});
mongoose_1.default
    .connect(mongodbURL)
    .then(() => {
    console.log(`connected with ${mongodbURL}`);
})
    .catch((err) => {
    console.log(err);
});
