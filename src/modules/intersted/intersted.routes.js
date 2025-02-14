import { Router } from "express"
// Change this line
import * as interestedCon from "./intersted.controller.js"  // Remove the 'e'

const router = Router()

router.post("/create", interestedCon.createInterested)
router.get("/", interestedCon.getAllInterested)
router.get("/:id", interestedCon.getOneInterested)
router.put("/:id", interestedCon.updateInterested)
router.delete("/:id", interestedCon.deleteInterested)

router.get("/unRead", interestedCon.unRead)
router.post("/markAsRead", interestedCon.markAsRead)

export default router