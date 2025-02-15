import { Router } from "express";
import * as consultationCon from "./consultation.controller.js"
const router = Router()

router.post("/create", consultationCon.createConsultation)
router.get("/", consultationCon.getAllConsultation)
router.get("/:id", consultationCon.getOneConsultation)
router.delete("/:id", consultationCon.deleteConsultation)
router.patch("/consultation/markAsCompleted/:id", consultationCon.markAsRead);
router.patch("/consultation/markAsCanceled/:id", consultationCon.markAsCanceled);
export default router


