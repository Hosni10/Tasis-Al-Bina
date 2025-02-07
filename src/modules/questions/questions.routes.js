import { Router } from "express";
import * as questionCon from "./questions.controller.js"
import { isAuth } from "../../middleware/isAuth.js";
import { addQuestionpoints } from "./questionEndPoints.js";


const router = Router()

router.post("/create",isAuth(addQuestionpoints.ADD_QUESTION),questionCon.createQuestion)
router.put("/update/:id",isAuth(addQuestionpoints.UPDATE_QUESTION),questionCon.UpdateQuestion)

// & with localization ☝


router.get("/",questionCon.getAllQuestion)
router.get("/:id",questionCon.getSingleQuestion)
router.delete("/:id",questionCon.deleteQuestion)


export default router