import { Router } from "express"
// Change this line
import * as interestedCon from "./intersted.controller.js"  // Remove the 'e'

const router = Router()

router.post("/create", interestedCon.createInterested)
router.get("/", interestedCon.getAllInterested)
router.put("/:id", interestedCon.updateInterested)
router.delete("/:id", interestedCon.deleteInterested)

router.get("/unread", interestedCon.unRead)
router.post("/markAsRead", interestedCon.markAsRead)

router.get("/getAllLastOneHour", interestedCon.getAllLastOneHour)
router.get("/findAllNotReaded", interestedCon.getAllUnReadInterested)



router.get("/getLastThreeIntersted", interestedCon.getLastThreeIntersted)


export default router