import { categoryModel } from "../../../database/models/category.model.js"
import { customAlphabet } from 'nanoid'
import imagekit, { destroyImage } from "../../utilities/imagekitConfigration.js"
import { pagination } from "../../utilities/pagination.js"
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5)

export const createcategory = async (req, res, next) => {
   try {
     const { title, area, description, location, latitude, longitude, lang } = req.body;
 
     if (!latitude || !longitude) {
       return next(new Error('Coordinates (latitude and longitude) are required.', { cause: 400 }));
     }
 
     if (!req.file) {
       return next(new Error('Please upload category image', { cause: 400 }));
     }
 
     const isCategoryExisting = await categoryModel.findOne({ title: title });
 
     if (isCategoryExisting) {
       return next(new Error("This category already exists.", { cause: 400 }));
     }
 
     const customId = nanoid();
 
     const uploadResult = await imagekit.upload({
       file: req.file.buffer,
       fileName: req.file.originalname,
       folder: `${process.env.PROJECT_FOLDER}/Category/${customId}`,
     });
 
     const categoryObject = {
       title,
       area,
       description,
       location,
       coordinates: {
         latitude: parseFloat(latitude), // Ensure it's stored as a number
         longitude: parseFloat(longitude),
       },
       customId,
       Image: {
         secure_url: uploadResult.url, 
         public_id: uploadResult.fileId,
       },
       lang,
     };
 
     const categoryData = await categoryModel.create(categoryObject);
 
     if (!categoryData) {
       await destroyImage(uploadResult.fileId);
       return next(new Error("Failed to upload category", { cause: 500 }));
     }
 
     res.status(201).json({ message: "Category created successfully", data: categoryData });
 
   } catch (error) {
     next(error);
   }
 };
 

 export const getAllCategory = async(req,res,next) => {
 
   // const {page, size} = req.query
   // const {limit, skip} = pagination({page, size}) 
   
   const category = await categoryModel.find()
   
   if(!category) return next(new Error("No category Founded",{cause:404}))
   
     const num = category.length
     res.status(201).json({message:`category Number : ${num}`,category})
}

export const getAllCategoryTitleImage = async(req,res,next) => {
 
   const {page, size} = req.query
   const {limit, skip} = pagination({page, size}) 
   
   const category = await categoryModel.find().select(`title Image`).limit(limit).skip(skip)
   
   if(!category) return next(new Error("No category Founded",{cause:404}))
   
     const num = category.length
     res.status(201).json({message:`category Number : ${num}`,category})
}

export const getOneCategory= async (req, res, next) => {
   try {
 
     
    
     const category = await categoryModel.findById(req.params.id);
     if (!category) {
       return next(new Error('category not found', { cause: 404 }));
     }
      
     res.status(200).json({ message: 'Done',category});
   } catch (error) {
     next(new Error(`Error deleting category: ${error.message}`, { cause: 500 }));
   }
 };

export const updateCategory = async(req,res,next) => {

   try {
      const {title,area,description,location,latitude,longitude} = req.body
      const id = req.params.id
   
     const category = await categoryModel.findById(id)
   
     if(!category) {
       return next(new Error("category Didn't Found",{cause:400}))
     }
   //   microservice archeture and distributed systems
     if(title) category.title = title
     if(area) category.area = area
     if(description) category.description = description
     if(location) category.location = location
     if(latitude) category.latitude = latitude
     if(longitude) category.longitude = longitude
   
     if(req.file){
       await destroyImage(category.Image.public_id);  
   
     const uploadResult = await imagekit.upload({
       file: req.file.buffer, 
       fileName: req.file.originalname,  
       folder: `${process.env.PROJECT_FOLDER}/Category/${category.customId}`, 
     });
   
     category.Image.secure_url = uploadResult.url,
     category.Image.public_id = uploadResult.fileId
   }
   
     await category.save()
     res.status(200).json({message : "category updated successfully",category})
   }  catch (error) {
     next(new Error(`fail to upload${error.message}`, { cause: 500 }));
   }
  
 }

export const deleteCategory= async (req, res, next) => {
  try {

    
   
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return next(new Error('category not found', { cause: 404 }));
    }
    
    await destroyImage(category.Image.public_id);    
    await categoryModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'category and image deleted successfully'});
  } catch (error) {
    next(new Error(`Error deleting category: ${error.message}`, { cause: 500 }));
  }
};



export const getAllCategoryTitleImageAR = async(req,res,next) => {
 
  const {page, size} = req.query
  const {limit, skip} = pagination({page, size}) 
  
  const category = await categoryModel.find({lang:"ar"}).select(`title Image`).limit(limit).skip(skip)
  
  if(!category) return next(new Error("No category Founded",{cause:404}))
  
    const num = category.length
    res.status(201).json({message:`category Number : ${num}`,category})
}

export const getAllCategoryTitleImageEN = async(req,res,next) => {
 
  const {page, size} = req.query
  const {limit, skip} = pagination({page, size}) 
  
  const category = await categoryModel.find({lang:"en"}).select(`title Image`).limit(limit).skip(skip)
  
  if(!category) return next(new Error("No category Founded",{cause:404}))
  
    const num = category.length
    res.status(201).json({message:`category Number : ${num}`,category})
}
export const getAllCategoryAR = async(req,res,next) => {
 
  const {page, size} = req.query
  const {limit, skip} = pagination({page, size}) 
  
  const category = await categoryModel.find({lang:"ar"})
  
  if(!category) return next(new Error("No category Founded",{cause:404}))
  
    const num = category.length
    res.status(201).json({message:`category Number : ${num}`,category})
}

export const getAllCategoryEN = async(req,res,next) => {
 
  const {page, size} = req.query
  const {limit, skip} = pagination({page, size}) 
  
  const category = await categoryModel.find({lang:"en"})
  
  if(!category) return next(new Error("No category Founded",{cause:404}))
  
    const num = category.length
    res.status(201).json({message:`category Number : ${num}`,category})
}