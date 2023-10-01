import { ObjectId } from "mongoose";
import { User } from "./user.interface";


export interface Task{
    _id:ObjectId
    title:string ,
    description:string ,
    status:"toDo"|"doing"|"done",
    userId:ObjectId ,
    assignTo:ObjectId , 
    deadline:Date
}

export type TaskAdd = Omit<Task,"_id">

export type TaskUpdate = Pick<Task,"title"|"description"|"status">

export type TaskWithUserData = Omit<Task,"userId"> & {userId:User}

export interface TaskDaoInterface{
    addTask(task:TaskAdd):Promise<Task>,
    updateTask(id:ObjectId,userId:ObjectId,task:TaskUpdate):Promise<Task|null>,
    deleteTask(id:ObjectId,userId:ObjectId):Promise<Task|null>,
    getAllTask():Promise<Task[]|[]>,
    getAllTaskWithUserData():Promise<TaskWithUserData[]|[]>,
    getAllTaskNotDoneAfterDeadline():Promise<Task[]|[]>,

}
