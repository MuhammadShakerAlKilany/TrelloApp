import { Router } from "express";
import guard from "../middleware/guard";
import {
  addTask,
  deleteTask,
  getAllTask,
  updateTask,
} from "../controller/task.controller";
import {
  taskIdSchema,
  taskJoiSchema,
  taskJoiSchemaUpdate,
} from "../joi/task.joi";
import {
  joiValidatorBody,
  joiValidatorParams,
} from "../middleware/joiValidator";
const route = Router();

route
  .route("/task")
  .all(guard)
  .get(getAllTask)
  .post(joiValidatorBody(taskJoiSchema), addTask);
route
  .route("/task/:id")
  .all(guard, joiValidatorParams(taskIdSchema))
  .patch(joiValidatorBody(taskJoiSchemaUpdate), updateTask)
  .delete(deleteTask);

export default route;
