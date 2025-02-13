import { Router } from "express"
import * as interestedController from "./interested.controller.js"

const router = Router()

router.post("/", interestedController.createInterested)
router.get("/", interestedController.getAllInterested)
router.get("/:id", interestedController.getOneInterested)
router.put("/:id", interestedController.updateInterested)
router.delete("/:id", interestedController.deleteInterested)

export default router
