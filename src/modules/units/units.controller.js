import { Unit } from "../../../database/models/unit.model.js";
import imagekit, { destroyImage } from "../../utilities/imagekitConfigration.js";
import { customAlphabet } from 'nanoid'
import { pagination } from "../../utilities/pagination.js";
import { apiFeatures } from "../../utilities/apisFeatures.js";
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5)

const addUnit = async (req, res, next) => {
  
 
  console.log(req.body);
  
  const unitData = JSON.parse(req.body.data)
  console.log(unitData);
  
  try {
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
      location,
      coordinates,
      nearbyPlaces,
      lang,
     } = unitData;


   
 
    // console.log(req.body);
    // console.log("nearbyPlaces",nearbyPlaces);
    // console.log("nearbyPlaces",nearbyPlaces.place[0]);
    // console.log("nearbyPlaces",nearbyPlaces.timeInMinutes[0]);
    // console.log(place);
    // console.log(timeInMinutes);
     

    if (!coordinates.latitude || !coordinates.longitude) {
      return next(new Error("Please provide both latitude and longitude for the unit's GPS coordinates.", { cause: 400 }));
    }


     

    if (!req.files || req.files.length === 0) {
      return next(new Error("Please upload at least one image for the unit", { cause: 400 }));
    }

    const customId = nanoid();
    const uploadedImages = [];

    console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDD");
    
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
      location,
      customId,
      nearbyPlaces,
      lang,
      coordinates 
      // createdBy:_id
    };

    console.log(unitObject);

     
    const unit = await Unit.create(unitObject);
    console.log(unit);
    
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

    const latitude = unit.coordinates.latitude
    const longitude = unit.coordinates.longitude 


    const returnedData =
    {
      unit,
      googleMapsLink: `https://www.google.com/maps/place/${latitude},${longitude}`
    }
  
  res.status(200).json({ message: "Success", returnedData });
};
const updateUnit = async (req, res, next) => {
  try {
    const unitData = JSON.parse(req.body.data)
    const unitId = req.params.id // Fixed params access

    const unit = await Unit.findById(unitId) // Changed to findById
    if (!unit) {
      return res.status(404).json({ message: "Unit not found" })
    }

    let updatedImages = unit.images || []

    if (req.files?.length > 0) {
      // Delete old images
      await Promise.all(
        unit.images.map(image => 
          imagekit.deleteFile(image.public_id)
            .catch(err => console.error(`Failed to delete image: ${image.public_id}`, err.message))
        )
      )

      // Upload new images
      updatedImages = await Promise.all(
        req.files.map(file => 
          imagekit.upload({
            file: file.buffer,
            fileName: file.originalname,
            folder: `${process.env.PROJECT_FOLDER}/Units/${unit.customId}`,
          }).then(result => ({
            secure_url: result.url,
            public_id: result.fileId,
          }))
        )
      )
    }

    const updatedUnit = await Unit.findByIdAndUpdate(
      unitId,
      {
        ...unitData,
        images: updatedImages,
        coordinates: {
          latitude: parseFloat(unitData.coordinates.latitude),
          longitude: parseFloat(unitData.coordinates.longitude),
        }
      },
      { new: true }
    )

    if (!updatedUnit) {
      return res.status(404).json({ message: "Unit not found" })
    }
    // console.log(updatedUnit);
    
    res.status(200).json({ message: "Unit updated successfully", updatedUnit })
  } catch (error) {
    next(new Error(`Failed to update the unit: ${error.message}`, { cause: 500 }))
  }
}

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

  const categoryId = req.params.id; // Get categoryId from query parameter
 //  console.log(categoryId);
  
  
   const units = await Unit.find({
     categoryId:categoryId,
    })
 
   if(!units) return next(new Error('in valid category id',{cause:400}))
 
     res.status(201).json({message:"Done",units})
 }
 const getAllUnitByCategoryIdAR = async (req,res,next) => {

 const categoryId = req.params.id; // Get categoryId from query parameter
//  console.log(categoryId);
 
 
  const units = await Unit.find({
    categoryId:categoryId,
    lang:"ar"
  })

  if(!units) return next(new Error('in valid category id',{cause:400}))

    res.status(201).json({message:"Done",units})
}

const getAllUnitByCategoryIdEN = async (req,res,next) => {

  const categoryId = req.params.id; // Get categoryId from query parameter
 //  console.log(categoryId);
  
  
   const units = await Unit.find({
     categoryId:categoryId,
     lang:"en"
   })
 
   if(!units) return next(new Error('in valid category id',{cause:400}))
 
     res.status(201).json({message:"Done",units})
}

 



 
export { addUnit, getUnit, updateUnit, deleteUnit, getAllUnits,getAllUnitsSorted,getUnitWithCategory,getAllUnitByCategoryId,getAllUnitByCategoryIdAR,getAllUnitByCategoryIdEN };

