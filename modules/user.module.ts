
import { Schema , model } from "mongoose";
import { User, UserUpdate } from "../interfaces/user.interface";
import bcrypt from "bcrypt"

const userSchema = new Schema<User>({
    userName: {
        type:String,
        required:true
    },
    email: {
        type:String,
        unique:true,
        required:true,
        
    },
    password:{
        type:String,
        required:true
    },
    age: {
        type:Number,
        required:true
    },
    gender: {
        type:String, 
        enum:["male" , "female"],
        required:true
    },
    phone: {
        type:Number,
        
    },
    isVerified: {
        type:Boolean,
        required:true,
        default:false
    },
    softDelete:{
        type:Boolean,
        required:true,
        default:false
    }
},{
    timestamps:true
})

userSchema.pre<User>("save",async function(){
   
const salt =await bcrypt.genSalt(10)
 const passwordHash = await bcrypt.hash(this.password,salt);
 this.password = passwordHash
    

})


export default model<User>("User",userSchema)

