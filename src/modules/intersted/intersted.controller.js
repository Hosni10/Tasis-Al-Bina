import { interstedModel } from "../../../database/models/intersted.model.js"
import { io } from "../../utilities/initiateApp.js";

// Create new interested entry
export const createInterested = async (req, res, next) => {
    try {
        console.log(req.body);
        
        const { fullName, phone, email, categoryId, unitId } = req.body

        const interested = await interstedModel.create({
            fullName,
            phone,
            email, 
            categoryId,
            unitId
        })
          io.emit('new_intersted', {            
            fullName,
            phone,
            email, 
            categoryId,
            unitId });

        res.status(201).json({ message: "Interest registered successfully", interested })
    } catch (error) {
        next(error)
    }
}

// Get all interested entries
export const getAllInterested = async (req, res, next) => {
    try {
        const interested = await interstedModel.find()
            .populate('categoryId')
            .populate('unitId')

            if (!interested) {
                return next(new Error("Interest records not found", { cause: 404 }))
            }
            if (interested.length > 0) {
                      io.emit("intersted-featch", interested)
                }
            
        res.status(200).json({ message: "Success", interested })
    } catch (error) {
        next(error) 
    }
}

export const unRead = async (req, res, next) => {
  try {
    const count = await interstedModel.countDocuments({ isRead: false })
    res.json({ count })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch unread count' })
  }
}

export const markAsRead = async (req, res, next) => {
  try {
    await interstedModel.updateMany(
      { isRead: false },
      { $set: { isRead: true}}
    )
    io.emit("intersted_read")

    res.json({ message: 'Marked as read' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark as read' })
  }
}

export const getAllLastOneHour = async (req, res, next) => {
  try {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const interstedData = await interstedModel.find({ createdAt: { $gte: oneHourAgo } })
    .populate('categoryId')
    .populate('unitId')
;

    // console.log(interstedData.length);
    
    if (interstedData.length === 0) return next(new Error('No emails found in the last hour', { cause: 404 }));

    if (interstedData.length > 0) {
      io.emit("last-one-hour-intersted", interstedData)
    }
    // console.log(interstedData);
    

    res.status(200).json({ message: "Emails from the last hour", interstedData });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get single interested entry
export const getOneInterested = async (req, res, next) => {
    try {
        const { id } = req.params
        const interested = await interstedModel.findById(id)
            .populate('categoryId')
            .populate('unitId')
         if (!interested) {
            return next(new Error("Interest record not found", { cause: 404 }))
        }
         res.status(200).json({ message: "Success", interested })
    } catch (error) {
        next(error)
    }
}

// Update interested entry
export const updateInterested = async (req, res, next) => {
    try {
        const { id } = req.params
        const { fullName, phone, email, categoryId, unitId } = req.body

        const interested = await interstedModel.findByIdAndUpdate(
            id,
            { fullName, phone, email, categoryId, unitId },
            { new: true }
        )

        if (!interested) {
            return next(new Error("Interest record not found", { cause: 404 }))
        }

        res.status(200).json({ message: "Updated successfully", interested })
    } catch (error) {
        next(error)
    }
}

// Delete interested entry
export const deleteInterested = async (req, res, next) => {
    try {
        const { id } = req.params
        const interested = await interstedModel.findByIdAndDelete(id)

        if (!interested) {
            return next(new Error("Interest record not found", { cause: 404 }))
        }

        res.status(200).json({ message: "Deleted successfully" })
    } catch (error) {
        next(error)
    }
}

export const getAllUnReadInterested = async (req, res, next) => {
    try {
        const interested = await interstedModel.find({ isRead: false })
            .populate('categoryId')
            .populate('unitId')

            if (!interested) {
                return next(new Error("Interest records not found", { cause: 404 }))
            }
            if (interested.length > 0) {
                      io.emit("intersted-featch", interested)
                }
            
        res.status(200).json({ message: "Success", interested })
    } catch (error) {
        next(error) 
    }
}


export const getLastThreeIntersted = async (req, res, next) => {
    try {
      const intested = await interstedModel.find()
      .select(`fullName phone email categoryId unitId`)
      .populate('categoryId', 'title')
      .populate('unitId', 'title')
      .sort({ createdAt: -1 })
      .limit(4)

      const count = await interstedModel.countDocuments();
      if (!intested || intested.length === 0) {
        return next(new Error("No intested Found", { cause: 404 }));
      }
  

      const returnedData = {
        intested,
        count,  
      }
      res.status(200).json({ message: "Last 4 intested and thair count", returnedData });
    } catch (error) {
      next(error);
    }
  };