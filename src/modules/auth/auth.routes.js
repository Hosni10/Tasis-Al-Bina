import { Router } from "express";
import * as AuthCon from './auth.controller.js'
import { isAuth } from "../../middleware/isAuth.js";
import { systemRoles } from "../../utilities/systemRole.js";

const router = Router()

//    router.post('/signUp',AuthCon.signUp) // ! for admin crate one account and will delete that api
   router.post('/signIn',AuthCon.login)

   router.post("/sendEmail",AuthCon.sendEmailBinCode)
   router.post("/add",isAuth(systemRoles.ADMIN),AuthCon.addUser)  

export default router

