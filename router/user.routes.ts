import {Router} from "express"
import { Verifi, deleteUser, login, logout, signUp, softDelete, updateUser } from "../controller/user.controller"
import { joiValidatorBody, joiValidatorParams } from "../middleware/joiValidator"
import { userJoiSchemaSignUp , userJoiSchemaLogeIn, userJoiSchemaUpdate, userJoiSchemaUpdateIdInBody } from "../joi/user.joi"
import guard from "../middleware/guard"
import { taskIdSchema } from "../joi/task.joi"

const router = Router()

router.post("/signUp",joiValidatorBody(userJoiSchemaSignUp),signUp)
router.post("/login",joiValidatorBody(userJoiSchemaLogeIn),login)
router.get("/verifie/:token",Verifi)
router.route("/softDelete").all(guard).delete(softDelete).get(softDelete)
router.route("/user").all(guard).patch(joiValidatorBody(userJoiSchemaUpdateIdInBody),updateUser).delete(deleteUser)
router.route("/user/:id").all(guard,joiValidatorParams(taskIdSchema)).patch(joiValidatorBody(userJoiSchemaUpdate),updateUser).delete(deleteUser)
router.get("/logout",guard,logout)

export default router