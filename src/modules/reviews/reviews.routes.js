import { Router } from "express";
import * as reviewCon from "./reviews.controller.js";
import { multerCloudFunction } from "../../services/multerCloud.js";
import { allowedExtensions } from "../../utilities/allowedExtensions.js";


const router = Router()

router.get("/",reviewCon.getAllReviews)
router.get("/:id",reviewCon.getSingleReview)
router.post("/create",multerCloudFunction(allowedExtensions.Image).single('image'),reviewCon.createReview)
router.put("/update/:id",multerCloudFunction(allowedExtensions.Image).single('image'),reviewCon.updateReview)
router.delete("/delete/:id",reviewCon.deleteReview)


export default router