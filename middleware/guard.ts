import { Request, RequestHandler } from "express";
import tryCatchErr from "./tryCatchErr";
import { ResInterface } from "../interfaces/app.interface";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../interfaces/user.interface";
const guard = tryCatchErr<never, ResInterface<any>>(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) return res.status(401).json({ message: "you are logOut" });
  try {
    const tokenData = jwt.verify(token, process.env.SECRET_KEY!);
    if (!tokenData) return res.status(401).json({ message: "you are logOut" });
  } catch (error) {
    res
      .clearCookie("token")
      .status(400)
      .json({ message: "err in jwt verify you are logOut" });
    return;
  }
  next();
});

export default guard;
