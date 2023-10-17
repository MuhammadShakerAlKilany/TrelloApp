import joi from "joi";
import { TaskAdd, TaskUpdate } from "../interfaces/task.interface";

export const taskJoiSchema = joi.object<TaskAdd>({
  title: joi.string().min(5).max(50).required(),
  description: joi.string().min(5).max(200).required(),
  status: joi.string().valid("toDo", "doing", "done"),
  userId: joi
    .string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  assignTo: joi
    .string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  deadline: joi.date().required(),
});

export const taskJoiSchemaUpdate = joi.object<TaskUpdate>({
  title: joi.string().min(5).max(50),
  description: joi.string().min(5).max(200),
  status: joi.string().valid("toDo", "doing", "done"),
});
export const taskIdSchema = joi.object<{ id: string }>({
  id: joi
    .string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});
