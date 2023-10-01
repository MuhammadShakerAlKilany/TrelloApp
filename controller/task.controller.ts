import { ObjectId } from "mongoose";
import TaskDao from "../dao/task.dao";
import UserDao from "../dao/user.dao";
import { ResInterface } from "../interfaces/app.interface";
import { Task, TaskAdd, TaskUpdate, TaskWithUserData } from "../interfaces/task.interface";
import tryCatchErr from "../middleware/tryCatchErr";
import jwt from "jsonwebtoken"
import { UserRes } from "../interfaces/user.interface";
const userDao = new UserDao()
const taskDao = new TaskDao()
export const addTask = tryCatchErr<TaskAdd,ResInterface<Task>>(async (req,res)=>{
    const body = req.body
if(!body)return res.status(404).json({message:"Not found body"})
const findUserId = await userDao.findUserById(body.userId)
if(!findUserId)return res.status(404).json({message:"Not found UserId"})
const findAssignTo = await userDao.findUserById(body.assignTo)
if(!findAssignTo)return res.status(404).json({message:"Not found AssignTo"})
body.deadline = new Date(body.deadline)

  const newTask =  await  taskDao.addTask(req.body)
  
  res.status(201).json({message:"Task Created", data:newTask})
})
export const updateTask = tryCatchErr<TaskUpdate,ResInterface<Task>,{id:string}>(async (req,res)=>{

const id =req.params.id as unknown as ObjectId
if(!id)return res.status(404).json({message:"No id found"})
const taskToUpdate = req.body
const token =  req.cookies?.token
const tokenData =  jwt.verify(token,process.env.SECRET_KEY!)as UserRes
if(!tokenData)return res.status(401).json({message:"you are logOut"})
if(!(taskToUpdate.title||taskToUpdate.status||taskToUpdate.description))return res.status(404).json({message:"No title||status||description found"})
const taskUpdated = await taskDao.updateTask(id,tokenData._id,taskToUpdate) 
if(!taskUpdated)return res.status(404).json({message:`No found task in id:${id} or you are not creator`})
res.json({message:"Updated task",data:taskUpdated})

})
export const deleteTask = tryCatchErr<never,ResInterface<Task>,{id:string}>(async (req,res)=>{
    const id =req.params.id as unknown as ObjectId
    if(!id)return res.status(404).json({message:"No id found"})
    const token =  req.cookies?.token
    const tokenData =  jwt.verify(token,process.env.SECRET_KEY!)as UserRes
if(!tokenData)return res.status(401).json({message:"you are logOut"})
    const taskDeleted = await taskDao.deleteTask(id,tokenData._id);
    if(!taskDeleted)return res.status(404).json({message:`No found task in id:${id} or you are not creator`})
    res.json({message:"Deleted task",data:taskDeleted})
})
export const getAllTask = tryCatchErr<never,ResInterface<TaskWithUserData[]|Task[]>,{id:string},{userData?:"true"|"false",afDed?:"true"|"false"}>(async (req,res)=>{
    const userData =req.query.userData
    const afDed =req.query.afDed
    if(afDed=="true"){
        const data = await taskDao.getAllTaskNotDoneAfterDeadline()
     
     return res.json({message:"All Task Not Done After Deadline",data})
    }else if(userData=="true"){
     const data = await taskDao.getAllTaskWithUserData()
     
     return res.json({message:"All Task With User Data",data})
    }else{
        const data = await taskDao.getAllTask()
     
     return res.json({message:"All Task With User Data",data})
    }
})
