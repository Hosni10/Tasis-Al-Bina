import { Router } from "express";
import * as questionCon from "./questions.controller.js"

const router = Router()


router.get("/",questionCon.getAllQuestion)
router.post("/create",questionCon.createQuestion)
router.put("/update/:id",questionCon.UpdateQuestion)
router.get("/:id",questionCon.getSingleQuestion)
router.delete("/:id",questionCon.deleteQuestion)


export default router