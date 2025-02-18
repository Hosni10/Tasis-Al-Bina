import { categoryModel } from "../../../database/models/category.model.js"
import { customAlphabet } from 'nanoid'
import imagekit, { destroyImage } from "../../utilities/imagekitConfigration.js"
import { pagination } from "../../utilities/pagination.js"
import { interstedModel } from "../../../database/models/intersted.model.js"
import { Unit } from "../../../database/models/unit.model.js"
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5)

export const createcategory = async (req, res, next) => {
   try {
console.log(req.body);
      // const unitData = JSON.parse(req.body)
      
      const { title, description, location, lang } = req.body;
      const latitude = parseFloat(req.body.latitude);
      const longitude = parseFloat(req.body.longitude);
      const area = parseFloat(req.body.area);
      if (isNaN(latitude) || isNaN(longitude)) {
        return next(new Error('Invalid coordinates format', { cause: 400 }));
      }
      
     console.log(latitude,longitude);
     
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
 console.log("Dddddddddddddddddd");
 
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
       coordinates:{
         latitude,
         longitude
       },
       customId,
       Image: {
         secure_url: uploadResult.url, 
         public_id: uploadResult.fileId,
       },
       lang,
     };
 console.log(categoryObject.coordinates);
 
     const categoryData = await categoryModel.create(categoryObject);
 
     if (!categoryData) {
       await destroyImage(uploadResult.fileId);
       return next(new Error("Failed to upload category", { cause: 500 }));
     }
 
     res.status(201).json({ message: "Category created successfully",  categoryData });
 
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

      const categoryId = req.params.id
   
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return next(new Error('category not found', { cause: 404 }));
    }
    
    await interstedModel.deleteMany({categoryId})
    await Unit.deleteMany({categoryId})
    
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
  
  const category = await categoryModel.find({lang:"en"})
  
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
  
  const category = await categoryModel.find({lang:"en"}).limit(limit).skip(skip)
  
  if(!category) return next(new Error("No category Founded",{cause:404}))
  
    const num = category.length
    res.status(201).json({message:`category Number : ${num}`,category})
}


export const getLastThreeCategory = async (req, res, next) => {
  try {
    const categories = await categoryModel.find().sort({ createdAt: -1 }).limit(3);
    if (!categories || categories.length === 0) {
      return next(new Error("No categories Found", { cause: 404 }));
    }

    res.status(200).json({ message: "Last 3 categories and counts", categories });
  } catch (error) {
    next(error);
  }
};

export const getLastThreeCategoryForDashboard = async (req, res, next) => {
  try {
    const categories = await categoryModel.find().select(`Image title description location`).sort({ createdAt: -1 }).limit(3);
    const count = await categoryModel.countDocuments();
    if (!categories || categories.length === 0) {
      return next(new Error("No categories Found", { cause: 404 }));
    }

    const returnedData = {
      count,
      categories,
    }
    res.status(200).json({ message: "Last 4 categories and counts", returnedData });
  } catch (error) {
    next(error);
  }
};

export const getAllCategoryARForDashboard = async(req,res,next) => {
 
  
  const category = await categoryModel.find({lang:"ar"})
  
  if(!category) return next(new Error("No category Founded",{cause:404}))
  
    const num = category.length
    res.status(201).json({message:`category Number : ${num}`,category})
}

export const getAllCategoryENForDashboard = async(req,res,next) => {
 
  
  const category = await categoryModel.find({lang:"en"})
  
  if(!category) return next(new Error("No category Founded",{cause:404}))
  
    const num = category.length
    res.status(201).json({message:`category Number : ${num}`,category})
}