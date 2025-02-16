import { Router } from "express";
import * as AuthCon from './auth.controller.js'
import { isAuth } from "../../middleware/isAuth.js";
import { addUsersEndpoints } from "./authEndpoints.js";

const router = Router()


router.get('/users',AuthCon.getAllUser) 

   router.post('/signUp',AuthCon.signUp) 
   router.post('/signIn',AuthCon.login)
   router.put('/update',AuthCon.updateUser)

   
    

   router.post("/sendEmail",AuthCon.sendEmailBinCode)
   router.post("/add",isAuth(addUsersEndpoints.ADD_USER),AuthCon.addUser)  

   router.get('/users',AuthCon.getAllUser) 
   router.get('/getOne',AuthCon.getOneUser) 
   router.post('/forget',AuthCon.forgetPassword)
  
   router.post("/sendEmailNew",AuthCon.sendEmailBinCodeToAdd)
   router.post('/reset',AuthCon.resetPassword)
   router.post('/logout',AuthCon.logout)


   router.delete('/delete/:id',isAuth(addUsersEndpoints.DELETE_USER),AuthCon.deleteUser)
   router.put('/update/:id',isAuth(addUsersEndpoints.UPDATE_USER),AuthCon.updateUserFromSuperAdmin)


   router.get('/usersCount',AuthCon.usersCount) 

export default router

