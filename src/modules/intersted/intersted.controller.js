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
