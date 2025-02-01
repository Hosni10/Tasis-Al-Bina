import { categoryModel } from "../../../database/models/category.model.js"
import { customAlphabet } from 'nanoid'
import imagekit, { destroyImage } from "../../utilities/imagekitConfigration.js"
import { pagination } from "../../utilities/pagination.js"
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5)

export const createcategory = async (req,res,next) => {
    
    try{
 
     const {title,area,location,latitude,longitude} = req.body
 
     if (!req.file) {
        return next(new Error('Please upload category image', { cause: 400 }))
    }
        
         const iscategoryExisting = await categoryModel.findOne({
             title:title
         })
     
         if(iscategoryExisting) return next(new Error("this question is already existing.",{cause:400}))
 
            const customId = nanoid()

            const uploadResult = await imagekit.upload({
                 file: req.file.buffer, 
                 fileName: req.file.originalname,  
                 folder: `${process.env.PROJECT_FOLDER}/Category/${customId}`, 
               });
 
         const categoryObject = {
             title,
             area,
             location,
             coordinates:{
                latitude,
                longitude,
             },
             customId,
             Image: {
                secure_url: uploadResult.url,       // image url that frontend can access the image 
                public_id: uploadResult.fileId,  // image path on imagekit website
              },
         }
 
         const categoryData = await categoryModel.create(categoryObject) 

 
         if(!categoryData) {
           await destroyImage(categoryData.Image.public_id);

            return next(new Error("Fail to Upload question",{cause:400}))

         }
         
        res.status(201).json({message:"category added successfully",categoryData})
     }catch (error) {
         next(new Error(`fail to upload${error.message}`, { cause: 500 }));
       }
}



 export const getAllCategory = async(req,res,next) => {
 
   const {page, size} = req.query
   const {limit, skip} = pagination({page, size}) 
   
   const category = await categoryModel.find().limit(limit).skip(skip)
   
   if(!category) return next(new Error("No category Founded",{cause:404}))
   
     const num = category.length
     res.status(201).json({message:`category Number : ${num}`,category})
}
 

