import { Router } from "express";
import * as consultationCon from "./consultation.controller.js"
const router = Router()

router.post("/create", consultationCon.createConsultation)
router.get("/", consultationCon.getAllConsultation)
router.get("/:id", consultationCon.getOneConsultation)
router.put("/:id", consultationCon.updateConsultation)
router.delete("/:id", consultationCon.deleteConsultation)

export default router


