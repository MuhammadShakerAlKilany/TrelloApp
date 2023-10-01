import {Schema,Types, model} from "mongoose";
import { Task } from "../interfaces/task.interface";


 const taskSchema = new Schema<Task>({
        title:{
                type:String,
                require:true
        } ,
        description:{
                type:String,
                require:true
        } ,
        status:{
                type:String,
                enum:["toDo","doing","done"],
               
                default:"toDo"
                },
        userId:{
                type:Types.ObjectId,
                required:true,
                ref:"User"
        } ,
        assignTo:{
                type: Types.ObjectId,
                required: true,
                ref:"User"
        } , 
        deadline:{
                type:Date,
                required:true
        }

},{
        timestamps:true
})

export default model<Task>("Task",taskSchema)