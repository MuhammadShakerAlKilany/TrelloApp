import express, { Express, RequestHandler, Router } from "express";
import mongoose from "mongoose";
import "dotenv";
import errorHandler from "./middleware/errorHandler";
import { routeApp } from "./router/app.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
const app: Express = express();
const port = process.env.PORT;
const mongodbURL: string =
  process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/TrelloApp";
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log("Method:", req.method, "URL:", req.url);
  next();
});

app.get("/api/v1", (req, res) => {
  res.send("<h1> Hi to my API  I'm Muhammad shaker AlKilany </h1>");
});

app.use("/api/v1", routeApp);

app.all("/*", (req, res) => {
  res.status(404).json({ message: `Not Found '${req.url}'` });
});
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server run in http://127.0.0.1:${port}/api/v1 `);
});

mongoose
  .connect(mongodbURL)
  .then(() => {
    console.log(`connected with ${mongodbURL}`);
  })
  .catch((err) => {
    console.log(err);
  });
