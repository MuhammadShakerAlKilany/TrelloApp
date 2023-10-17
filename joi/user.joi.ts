import joi, { string } from "joi";
import {
  UserLogin,
  UserSignUp,
  UserUpdate,
} from "../interfaces/user.interface";

export const userJoiSchemaSignUp = joi.object<UserSignUp>({
  userName: joi.string().min(5).max(30).required(),
  email: joi
    .string()
    .email({ tlds: { allow: ["com", "net", "lol"] } })
    .required(),
  password: joi
    .string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,100}$/)
    .required(),
  age: joi.number().min(18).max(60).required(),
  gender: joi.string().valid("male", "female").required(),
  phone: joi.string().pattern(/^0(10|11|12|15)\d{8}$/),
});
export const userJoiSchemaLogeIn = joi.object<UserLogin>({
  email: joi
    .string()
    .email({ tlds: { allow: ["com", "net", "lol"] } })
    .required(),
  password: joi
    .string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .required(),
});
export const userJoiSchemaUpdate = joi.object<UserUpdate>({
  userName: joi.string().min(5).max(30),
  age: joi.number().min(18).max(60),
  password: joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
});
type UserUpdateIdInBody = UserUpdate & { id: string };
export const userJoiSchemaUpdateIdInBody = joi.object<UserUpdateIdInBody>({
  id: joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  userName: joi.string().min(5).max(30),
  age: joi.number().min(18).max(60),
  password: joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
});
export const userIdSchema = joi.object<{ id: string }>({
  id: joi
    .string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});
