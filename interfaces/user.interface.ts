import { ObjectId } from "mongoose";
export interface User extends Date {
  _id: ObjectId;
  userName: string;
  email: string;
  password: string;
  age: number;
  gender: "male" | "female";
  phone?: string;
  isVerified: boolean;
  softDelete: boolean;
}
export type UserSignUp = Omit<User, "_id" | "isVerified" | "softDelete">;
export type UserLogin = Pick<User, "email" | "password">;
export type UserUpdate = Pick<User, "age" | "password" | "userName">;

export interface UserDaoInterface {
  addUser(user: UserSignUp): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  updateUser(id: ObjectId, user: UserUpdate): Promise<User | null>;
  verifie(id: ObjectId, isVerified: boolean): Promise<User | null>;
  deleteUserById(id: ObjectId): Promise<User | null>;
  softDeleteUser(id: ObjectId, softDelete: boolean): Promise<User | null>;
  findUserById(id: ObjectId): Promise<User | null>;
}

export type UserRes = Omit<User, "password"> & {
  password: string | undefined;
};
