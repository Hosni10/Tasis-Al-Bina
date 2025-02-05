import { Unit } from "../../../database/models/unit.model.js";
import imagekit, { destroyImage } from "../../utilities/imagekitConfigration.js";
import { customAlphabet } from 'nanoid'
import { pagination } from "../../utilities/pagination.js";
import { apiFeatures } from "../../utilities/apisFeatures.js";
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5)

const addUnit = async (req, res, next) => {
  
  try {
    const {_id} = req.authUser
    const {
      title,
      type,
      description,
      area,
      categoryId,
      price,
      parking,
      guard,
      rooms,
      elevators,
      cameras,
      bathrooms,
      livingrooms,
      status,
      waterTank,
      floor,
      maidRoom,
      driverRoom,
      location,
      latitude,
      longitude,
      nearbyPlaces,
    } = req.body;

    // console.log(req.body);
    // console.log("nearbyPlaces",nearbyPlaces);
    // console.log("nearbyPlaces",nearbyPlaces.place[0]);
    // console.log("nearbyPlaces",nearbyPlaces.timeInMinutes[0]);
    // console.log(place);
    // console.log(timeInMinutes);

    if (!latitude || !longitude) {
      return next(new Error("Please provide both latitude and longitude for the unit's GPS coordinates.", { cause: 400 }));
    }

    if (!req.files || req.files.length === 0) {
      return next(new Error("Please upload at least one image for the unit", { cause: 400 }));
    }

    const customId = nanoid();
    const uploadedImages = [];

    for (const file of req.files) {
      const uploadResult = await imagekit.upload({
        file: file.buffer, 
        fileName: file.originalname,
        folder: `${process.env.PROJECT_FOLDER}/Units/${customId}`,
      });

      uploadedImages.push({
        secure_url: uploadResult.url,
        public_id: uploadResult.fileId,
      });
    }

    const unitObject = {
      title,
      type,
      description,
      area,
      price,
      images: uploadedImages,
      rooms,
      categoryId,
      bathrooms,
      livingrooms,
      rooms,
      parking,
      guard,
      elevators,
      cameras,
      waterTank,
      floor,
      status,
      maidRoom,
      driverRoom,
      location,
      customId,
      nearbyPlaces,
      coordinates: { latitude, longitude }, // Include coordinates
      // createdBy:_id
    };

    const unit = await Unit.create(unitObject);

    if (!unit) {
      for (const image of uploadedImages) {
        await destroyImage(image.public_id);
      }
      return next(new Error("Failed to add the unit. Please try again later.", { cause: 400 }));
    }

    res.status(201).json({ message: "Unit created successfully", unit });
  } catch (error) {
    next(new Error(`Failed to add the unit: ${error.message}`, { cause: 500 }));
  }
};

const getUnit = async (req, res) => {
  
  const unit = await Unit.findById(req.params.id);

  if (!unit) return next(new Error("unit not found",{cause:404}))
  
  res.status(200).json({ message: "Success", unit });
};

const updateUnit = async (req, res, next) => {
  try {
    const {_id} = req.authUser
    const { unitId } = req.params
    const {
      title,
      type,
      description,
      area,
      price,
      parking,
      guard,
      rooms,
      elevators,
      cameras,
      bathrooms,
      livingrooms,
      status,
      waterTank,
      floor,
      maidRoom,
      driverRoom,
      location,
      latitude,
      longitude,
      nearbyPlaces,
    } = req.body;

    const unit = await Unit.findOne({id:unitId,createdBy:_id});
    if (!unit) return res.status(404).json({ message: "Unit not found , you are not the owner of this unit" });

    let updatedImages = unit.images || []; 

    if (req.files && req.files.length > 0) {

      for (const image of unit.images) {
        try {
          await imagekit.deleteFile(image.public_id); 
        } catch (err) {
          console.error(`Failed to delete image: ${image.public_id}`, err.message);
        }
      }

      const newImages = [];
      for (const file of req.files) {
        const uploadResult = await imagekit.upload({
          file: file.buffer, // Image buffer
          fileName: file.originalname, // Original file name
          folder: `${process.env.PROJECT_FOLDER}/Units/${unit.customId}`, // Folder path in ImageKit
        });
        newImages.push({
          secure_url: uploadResult.url,
          public_id: uploadResult.fileId,
        });
      }

      updatedImages = newImages;
    }

    const updatedUnit = await Unit.findByIdAndUpdate(
      req.params.id,
      {
        title,
        type,
        description,
        area,
        price,
        images: updatedImages, // Replace with the updated image array
        rooms,
        elevators,
        cameras,
        bathrooms,
        livingrooms,
        waterTank,
        floor,
        parking,
        guard,
        nearbyPlaces,
        status,
        maidRoom,
        driverRoom,
        location,
        coordinates: { latitude, longitude }, 
      },
      { new: true } 
    );

    res.status(200).json({ message: "Unit updated successfully", updatedUnit });
  } catch (error) {
    next(new Error(`Failed to update the unit: ${error.message}`, { cause: 500 }));
  }
};

const deleteUnit = async (req, res, next) => {
  try {
    const {_id} = req.authUser
    const { unitId } = req.params
    const unit = await Unit.findOne({id:unitId,createdBy:_id});
    if (!unit) {
      return res.status(404).json({  message: "Unit not found , you are not the owner of this unit" });
    }

    if (unit.images && unit.images.length > 0) {
      for (const image of unit.images) {
        try {
          await imagekit.deleteFile(image.public_id); 
        } catch (error) {
          console.error(`Failed to delete image: ${image.public_id}`, error.message);
        }
      }
    }

    const deletedUnit = await Unit.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Unit deleted successfully", deletedUnit });
  } catch (error) {
    next(new Error(`Failed to delete unit: ${error.message}`, { cause: 500 }));
  }
};

const getAllUnits = async (req, res) => {

  const {page, size} = req.query
  const {limit, skip} = pagination({page, size}) 

  const units = await Unit.find().limit(limit).skip(skip)

  res.status(200).json({ message: "Success", units})
}


const getAllUnitsSorted = async (req, res) => {

const apiFeatureInstance = new apiFeatures(Unit.find({}),req.query).sort()
const units = await apiFeatureInstance.mongooQuery

  res.status(200).json({ message: "Success", units})

}

// get all unit with the full category data
const getUnitWithCategory = async (req,res,next) => {
    const unit = await Unit.find().populate([
        {
            path: 'categoryId',
        }
    ])
    res.status(200).json({ message: 'Done', unit })
}

// get all unit by category id
const getAllUnitByCategoryId = async (req,res,next) => {

 const categoryId = req.query.categoryId; // Get categoryId from query parameter
 
  const units = await Unit.find({
    categoryId:categoryId
  })

  if(!units) return next(new Error('in valid category id',{cause:400}))

    res.status(201).json({message:"Done",units})
}



// const getAllUnits = async (req, res) => {
//   const {
//     limit = 10,
//     page = 1,
//     sortBy = "price",
//     sortOrder = "desc",
//     search = "",
//   } = req.query;
//   const query = {};
//   if (search) {
//     query.$or = [
//       { title: { $regex: search, $options: "i" } },
//       { description: { $regex: search, $options: "i" } },
//       { location: { $regex: search, $options: "i" } },
//     ];
//   }
//   Object.keys(filters).forEach((key) => {
//     if (filters[key]) {
//       query[key] = filters[key];
//     }
//   });

//   const skip = (page - 1) * limit;

//   const units = await Unit.find(query)

//     .sort({ [sortOrder]: sortBy === "desc" ? -1 : 1 })
//     .skip(skip)
//     .limit(limit);

//     const totalDocs = await Unit.countDocuments(query);

//   res.status(200).json({ message: "Success", units ,
//     pagination: {
//       page,
//       limit,
//       totalDocs,
//       totalPages: Math.ceil(totalDocs / limit),
//     },
//    });
// };

export { addUnit, getUnit, updateUnit, deleteUnit, getAllUnits,getAllUnitsSorted,getUnitWithCategory,getAllUnitByCategoryId };

