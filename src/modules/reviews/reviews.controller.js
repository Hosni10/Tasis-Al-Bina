import { reviewsModel } from "../../../database/models/reviews.model.js";
import { customAlphabet } from 'nanoid'
import imagekit, { destroyImage } from "../../utilities/imagekitConfigration.js";
import { pagination } from "../../utilities/pagination.js";
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5)


export const createReview = async(req,res,next) => {
    try {
    
    const { name,country,rate,description,lang } = req.body
  
      if (!req.file) {
          return next(new Error('Please upload profile image', { cause: 400 }))
      }
  
      // ~ console.log(req.body);  
      // ~ console.log(req.file);   
  
      const customId = nanoid()
  
        // console.log(req.file.originalname,"req.file.originalname");
        // console.log(req.file.buffer,"req.file.buffer");
        
   
          const uploadResult = await imagekit.upload({
            file: req.file.buffer, 
            fileName: req.file.originalname,  
            folder: `${process.env.PROJECT_FOLDER}/Reviews/${customId}`, 
          });
       
          //  console.log(uploadResult);
          
          const ReviewsObject = {
            name,
            country,
            rate,
            description,
            // createdBy,
            lang,
            customId,
            Image: {
              secure_url: uploadResult.url,       // image url that frontend can access the image 
              public_id: uploadResult.fileId,  // image path on imagekit website
            },
          };
      
          const review = await reviewsModel.create(ReviewsObject);
      
          if (!review) {
             await destroyImage(review.Image.public_id);
             return next(new Error('Try again later, failed to add', { cause: 400 }));
          }
      
          res.status(200).json({ message: 'review added successfully', review });
        } catch (error) {
          next(new Error(`Failed to upload image: ${error.message}`, { cause: 500 }));
        }
  
}

export const getAllReviews = async(req,res,next) => {


  const {page, size} = req.query
  const {limit, skip} = pagination({page, size}) 

  const reviews = await reviewsModel.find()

  if(!reviews) return next(new Error("No reviews Founded",{cause:404}))

    const num = reviews.length
    res.status(201).json({message:"Done",reviews})
}

export const getSingleReview = async(req,res,next) => {

  const id = req.params.id
  const review = await reviewsModel.findById(id)

  if(!review) return next(new Error("No review Didn't Found",{cause:404}))

    res.status(201).json({message:"review:",review})
}

export const updateReview = async(req,res,next) => {

  try {
    const { name,country,rate,description } = req.body
    const id = req.params.id
  
    const review = await reviewsModel.findById(id)
  
    if(!review) {
      return next(new Error("review Didn't Found",{cause:400}))
    }
  
    if(name) review.name = name
    if(country) review.country = country
    if(rate) review.rate = rate
    if(description) review.description = description
  
    if(req.file){
      await destroyImage(review.Image.public_id);  
  
    const uploadResult = await imagekit.upload({
      file: req.file.buffer, 
      fileName: req.file.originalname,  
      folder: `${process.env.PROJECT_FOLDER}/Reviews/${review.customId}`, 
    });
  
    review.Image.secure_url = uploadResult.url,
    review.Image.public_id = uploadResult.fileId
  }
  
    await review.save()
    res.status(200).json({message : "review updated successfully",review})
  }  catch (error) {
    next(new Error(`fail to upload${error.message}`, { cause: 500 }));
  }
 
}

export const deleteReview= async (req, res, next) => {
  try {
console.log(req.params.id);
    
    const review = await reviewsModel.findById(req.params.id);
    if (!review) {
      return next(new Error('review not found', { cause: 404 }));
    }
    
   await destroyImage(review.Image.public_id);    
    await reviewsModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'review and image deleted successfully'});
  } catch (error) {
    next(new Error(`Error deleting review: ${error.message}`, { cause: 500 }));
  }
};



export const getAllReviewAR = async (req,res,next) => {
  try{

       const reviews = await reviewsModel.find({lang:"ar"})
       if(!reviews) return next(new Error("didn't found the review .",{cause:404}))
       
       res.status(201).json({message : `Review`,reviews})
     }  catch (error) {
       next(new Error(`fail to upload ${error.message}`, { cause: 500 }));
     }
}


export const getAllReviewEN = async (req,res,next) => {
  try{

       const reviews = await reviewsModel.find({lang:"en"})
       if(!reviews) return next(new Error("didn't found the review .",{cause:404}))
       
       res.status(201).json({message : `Review: `,reviews})
     }  catch (error) {
       next(new Error(`fail to upload ${error.message}`, { cause: 500 }));
     }
}