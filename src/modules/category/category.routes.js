import { Router } from "express";
import * as categoryCont from "./category.controller.js" 
import { multerCloudFunction } from "../../services/multerCloud.js";
import { allowedExtensions } from "../../utilities/allowedExtensions.js";


const router = Router()


router.post("/",categoryCont.getAllCategory)
router.get("/create",multerCloudFunction(allowedExtensions.Image).single('image'),categoryCont.createcategory)



export default router