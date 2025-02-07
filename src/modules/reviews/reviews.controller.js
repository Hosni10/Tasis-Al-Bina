import { reviewsModel } from "../../../database/models/reviews.model.js";
import { customAlphabet } from 'nanoid'
import imagekit, { destroyImage } from "../../utilities/imagekitConfigration.js";
import { pagination } from "../../utilities/pagination.js";
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5)

export const createReview = async (req, res, next) => {
  try {
    const { _id } = req.authUser;

    const { name, country, rate, description } = req.body;

    if (!req.file) {
      return next(new Error("Please upload a profile image", { cause: 400 }));
    }

    // Ensure both Arabic & English fields exist
    if (
      !name?.en ||
      !name?.ar ||
      !country?.en ||
      !country?.ar ||
      !description?.en ||
      !description?.ar
    ) {
      return next(new Error("Both 'en' and 'ar' fields are required for name, country, and description.", { cause: 400 }));
    }

    const customId = nanoid();

    // Upload image
    const uploadResult = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: `${process.env.PROJECT_FOLDER}/Reviews/${customId}`,
    });

    // Create review object
    const ReviewsObject = {
      name,
      country,
      rate,
      description,
      createdBy: _id, // Ensure it's linked to the authenticated user
      customId,
      Image: {
        secure_url: uploadResult.url, // Image URL that frontend can access
        public_id: uploadResult.fileId, // Image ID on ImageKit
      },
    };

    const review = await reviewsModel.create(ReviewsObject);

    if (!review) {
      await destroyImage(uploadResult.fileId); // Delete uploaded image if creation fails
      return next(new Error("Try again later, failed to add", { cause: 400 }));
    }

    res.status(200).json({ message: "Review added successfully", review });
  } catch (error) {
    next(new Error(`Failed to upload image: ${error.message}`, { cause: 500 }));
  }
};



export const updateReview = async (req, res, next) => {
  try {
    const { name, country, rate, description } = req.body;
    const id = req.params.id;

    
    // Find the review by ID
    const review = await reviewsModel.findOne({id:id,createdBy:_id});
    if (!review) {
      return next(new Error("Review not found", { cause: 404 }));
    }

    // Ensure both Arabic & English fields exist when updating
    if (name) {
      if (!name.en || !name.ar) {
        return next(new Error("Both 'en' and 'ar' fields are required for name.", { cause: 400 }));
      }
      review.name = name;
    }

    if (country) {
      if (!country.en || !country.ar) {
        return next(new Error("Both 'en' and 'ar' fields are required for country.", { cause: 400 }));
      }
      review.country = country;
    }

    if (description) {
      if (!description.en || !description.ar) {
        return next(new Error("Both 'en' and 'ar' fields are required for description.", { cause: 400 }));
      }
      review.description = description;
    }

    if (rate) review.rate = rate;

    // Handle Image Update
    if (req.file) {
      await destroyImage(review.Image.public_id); // Delete old image

      const uploadResult = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: `${process.env.PROJECT_FOLDER}/Reviews/${review.customId}`,
      });

      review.Image.secure_url = uploadResult.url;
      review.Image.public_id = uploadResult.fileId;
    }

    await review.save();
    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    next(new Error(`Failed to update review: ${error.message}`, { cause: 500 }));
  }
};



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


export const deleteReview= async (req, res, next) => {
  try {

    
    const review = await reviewsModel.findById(req.params.id);
    if (!review) {
      return next(new Error('review not found', { cause: 404 }));
    }
    
    const deleteResult = await destroyImage(review.Image.public_id);    
    await reviewsModel.deleteMany();

    res.status(200).json({ message: 'review and image deleted successfully'});
  } catch (error) {
    next(new Error(`Error deleting review: ${error.message}`, { cause: 500 }));
  }
};
