import { Router } from "express";
import * as AuthController from './auth.controller.js'

const router = Router()

router.post('/signUp',AuthController.signUp)
router.get('/confirm/:token',AuthController.confirmEmail)


export default router

