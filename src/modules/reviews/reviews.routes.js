import { Router } from "express";
import * as reviewCon from "./reviews.controller.js";
import { multerCloudFunction } from "../../services/multerCloud.js";
import { allowedExtensions } from "../../utilities/allowedExtensions.js";
import { isAuth } from "../../middleware/isAuth.js";
import { addReviewpoints } from "./reviewEndpoints.js";


const router = Router()

router.post("/create",isAuth(addReviewpoints.ADD_REVIEW),multerCloudFunction(allowedExtensions.Image).single('image'),reviewCon.createReview)
router.put("/update/:id",isAuth(addReviewpoints.UPDATE_REVIEW),multerCloudFunction(allowedExtensions.Image).single('image'),reviewCon.updateReview)

// & with localization ☝


router.get("/",reviewCon.getAllReviews)
router.get("/:id",reviewCon.getSingleReview)
router.delete("/delete/:id",reviewCon.deleteReview)


export default router