import { Schema } from "mongoose";
import {
  User,
  UserDaoInterface,
  UserSignUp,
  UserUpdate,
} from "../interfaces/user.interface";
import userModule from "../modules/user.module";
import bcrypt from "bcrypt";
export default class UserDao implements UserDaoInterface {
  async findUserById(id: Schema.Types.ObjectId): Promise<User | null> {
    return await userModule.findById(id);
  }
  async verifie(
    id: Schema.Types.ObjectId,
    isVerified: boolean
  ): Promise<User | null> {
    return await userModule.findByIdAndUpdate(
      id,
      { isVerified },
      { new: true }
    );
  }
  async addUser(user: UserSignUp): Promise<User> {
    return await userModule.create(user);
  }
  async findUserByEmail(email: string): Promise<User | null> {
    return await userModule.findOne({ email });
  }
  async updateUser(
    id: Schema.Types.ObjectId,
    user: UserUpdate
  ): Promise<User | null> {
    if (user.password) {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(user.password, salt);
      user.password = passwordHash;
    }
    return await userModule.findByIdAndUpdate(id, user, { new: true });
  }
  async deleteUserById(id: Schema.Types.ObjectId): Promise<User | null> {
    return await userModule.findByIdAndDelete(id);
  }
  async softDeleteUser(
    id: Schema.Types.ObjectId,
    softDelete: boolean
  ): Promise<User | null> {
    return await userModule.findByIdAndUpdate(
      id,
      { softDelete },
      { new: true }
    );
  }
}
