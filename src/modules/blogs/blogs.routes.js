import { Router } from "express";
import * as BlogCon from "./blogs.controller.js"
import { multerCloudFunction } from "../../services/multerCloud.js";
import { allowedExtensions } from "../../utilities/allowedExtensions.js";
import { isAuth } from "../../middleware/isAuth.js";
import { addBlogpoints } from "./blogsEndPoints.js";

const router = Router()


router.get("/",BlogCon.getAllBlogs)
router.get("/findOne/:id",BlogCon.getSingleBlogs)
router.post("/create",isAuth(addBlogpoints.ADD_BLOG),multerCloudFunction(allowedExtensions.Image).single('image'),BlogCon.createBlog)
router.put("/update/:id",multerCloudFunction(allowedExtensions.Image).single('image'),BlogCon.updateBlog)
router.delete("/delete/:id",BlogCon.deleteBlog)


router.get("/getLastThree",BlogCon.getLastThreeBlogs)

router.get("/getAllBlogsAR",BlogCon.getAllBlogsAR)
router.get("/getAllBlogsEN",BlogCon.getAllBlogsEN)



export default router