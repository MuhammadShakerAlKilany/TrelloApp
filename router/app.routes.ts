import { Router } from "express";
import userRouter from "./user.routes";
import taskRouter from "./task.routes";

export const routeApp =Router()

routeApp.use("/users",userRouter)
routeApp.use("/tasks",taskRouter)
  