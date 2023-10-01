import { NextFunction ,Response ,Request , RequestHandler} from "express"


export default  function tryCatchErr<ReqBody,ResBody=never,Params=never,ReqQuery=never>(fun:RequestHandler<Params,ResBody,ReqBody,ReqQuery>){
     const tryCatchFun:RequestHandler<Params,ResBody,ReqBody,ReqQuery> =  async  (req,res,next)=>{
        try {
            
         await fun(req,res,next)
        } catch (error) {
        
        next(error)
        }
    }
    return tryCatchFun
}