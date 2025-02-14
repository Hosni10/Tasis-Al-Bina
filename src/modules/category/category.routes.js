import { Router } from "express";
import * as categoryCont from "./category.controller.js" 
import { multerCloudFunction } from "../../services/multerCloud.js";
import { allowedExtensions } from "../../utilities/allowedExtensions.js";


const router = Router()


router.post("/create",multerCloudFunction(allowedExtensions.Image).single('image'),categoryCont.createcategory)
router.get("/",categoryCont.getAllCategory)

// & get all category (title,Image) only
router.get("/getAllCategoryTitleImage",categoryCont.getAllCategoryTitleImage)

router.put("/update/:id",categoryCont.updateCategory)
router.get("/getOne/:id",categoryCont.getOneCategory)

router.delete("/delete/:id",categoryCont.deleteCategory)

router.get("/getAllCategoryTitleImageAR",categoryCont.getAllCategoryTitleImageAR)
router.get("/getAllCategoryTitleImageEN",categoryCont.getAllCategoryTitleImageEN)
router.get("/getAllCategoryEN",categoryCont.getAllCategoryEN)
router.get("/getAllCategoryAR",categoryCont.getAllCategoryAR)


export default router