import { Router } from "express";
import * as questionCon from "./questions.controller.js"

const router = Router()


router.post("/create",questionCon.createQuestion)
router.put("/update/:id",questionCon.UpdateQuestion)
router.get("/",questionCon.getAllQuestion)
router.get("/getOne/:id",questionCon.getSingleQuestion)
router.delete("/:id",questionCon.deleteQuestion)


router.get("/ar",questionCon.getAllQuestionAR)
router.get("/en",questionCon.getAllQuestionEN)



export default router