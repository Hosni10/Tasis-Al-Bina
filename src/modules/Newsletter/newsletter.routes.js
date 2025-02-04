import { Router } from "express";
import * as newsletterCont from "./newsletter.controller.js" 
const router = Router()

router.post('/create',newsletterCont.createNewsletter)


export default router