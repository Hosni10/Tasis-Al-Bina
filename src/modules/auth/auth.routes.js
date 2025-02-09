import { Router } from "express";
import * as AuthCon from './auth.controller.js'
import { isAuth } from "../../middleware/isAuth.js";
import { addUsersEndpoints } from "./authEndpoints.js";

const router = Router()


router.get('/users',AuthCon.getAllUser) // ! for admin crate one account and will delete that api

   router.post('/signUp',AuthCon.signUp) // ! for admin crate one account and will delete that api
   router.post('/signIn',AuthCon.login)

   router.post("/sendEmail",AuthCon.sendEmailBinCode)
   router.post("/add",AuthCon.addUser)  

   router.get('/users',AuthCon.getAllUser) // ! for admin crate one account and will delete that api
   router.post('/forget',AuthCon.forgetPassword)
  
   router.post("/sendEmailNew",AuthCon.sendEmailBinCode)
   router.post('/reset',AuthCon.resetPassword)
   router.post('/logout',AuthCon.logout)
export default router

