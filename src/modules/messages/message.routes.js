import { Router } from "express";
import * as messageCon from "./message.controller.js"
const router = Router()

router.get('/',messageCon.getAllMessages)
router.get('/:id',messageCon.getSingleMessage)
router.post('/create',messageCon.createMessage)
router.delete('/delete/:id',messageCon.deleteMessage)


export default router