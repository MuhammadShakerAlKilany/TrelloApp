import { Schema } from "mongoose";
import {
  Task,
  TaskAdd,
  TaskDaoInterface,
  TaskUpdate,
  TaskWithUserData,
} from "../interfaces/task.interface";
import taskModule from "../modules/task.module";
export default class TaskDao implements TaskDaoInterface {
  async addTask(task: TaskAdd): Promise<Task> {
    return await taskModule.create(task);
  }
  async updateTask(
    id: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    task: TaskUpdate
  ): Promise<Task | null> {
    return await taskModule.findOneAndUpdate({ _id: id, userId }, task, {
      new: true,
    });
  }
  async deleteTask(
    id: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId
  ): Promise<Task | null> {
    return await taskModule.findOneAndDelete({ _id: id, userId });
  }
  async getAllTask(): Promise<[] | Task[]> {
    return await taskModule.find();
  }
  async getAllTaskWithUserData(): Promise<[] | TaskWithUserData[]> {
    return await taskModule.find().populate([
      { path: "userId", select: "-password" },
      { path: "assignTo", select: "-password" },
    ]);
  }

  async getAllTaskNotDoneAfterDeadline(): Promise<[] | Task[]> {
    const know = new Date();
    return await taskModule.find({
      deadline: { $lt: know },
      status: { $ne: "done" },
    });
  }
}
