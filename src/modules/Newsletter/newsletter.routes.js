import { Router } from "express";
import * as newsletterCont from "./newsletter.controller.js" 
const router = Router()

router.post('/create',newsletterCont.createNewsletter)
router.get('/',newsletterCont.getAllEmails)
router.get('/unread',newsletterCont.unRead)
router.post('/markAsRead',newsletterCont.markAsRead)


router.get('/all',newsletterCont.getAll)



export default router