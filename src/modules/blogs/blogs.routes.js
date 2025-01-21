import { Router } from "express";
import * as BlogCon from "./blogs.controller.js"
import { multerCloudFunction } from "../../services/multerCloud.js";
import { allowedExtensions } from "../../utilities/allowedExtensions.js";

const router = Router()

router.get("/",BlogCon.getAllBlogs)
router.get("/:id",BlogCon.getSingleBlogs)
router.post("/create",multerCloudFunction(allowedExtensions.Image).single('image'),BlogCon.createBlog)
router.put("/update/:id",multerCloudFunction(allowedExtensions.Image).single('image'),BlogCon.updateBlog)
router.delete("/delete/:id",BlogCon.deleteBlog)


export default router