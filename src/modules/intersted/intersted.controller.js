// import { interstedModel } from "../../../database/models/intersted.model"

// // Create new interested entry
// export const createInterested = async (req, res, next) => {
//     try {
//         const { fullName, phone, email, categoryId, unitId } = req.body

//         const interested = await interstedModel.create({
//             fullName,
//             phone,
//             email, 
//             categoryId,
//             unitId
//         })

//         res.status(201).json({ message: "Interest registered successfully", interested })
//     } catch (error) {
//         next(error)
//     }
// }

// // Get all interested entries
// export const getAllInterested = async (req, res, next) => {
//     try {
//         const interested = await interstedModel.find()
//             .populate('categoryId')
//             .populate('unitId')

//         res.status(200).json({ message: "Success", interested })
//     } catch (error) {
//         next(error) 
//     }
// }

// // Get single interested entry
// export const getOneInterested = async (req, res, next) => {
//     try {
//         const { id } = req.params
//         const interested = await interstedModel.findById(id)
//             .populate('categoryId')
//             .populate('unitId')

//         if (!interested) {
//             return next(new Error("Interest record not found", { cause: 404 }))
//         }

//         res.status(200).json({ message: "Success", interested })
//     } catch (error) {
//         next(error)
//     }
// }

// // Update interested entry
// export const updateInterested = async (req, res, next) => {
//     try {
//         const { id } = req.params
//         const { fullName, phone, email, categoryId, unitId } = req.body

//         const interested = await interstedModel.findByIdAndUpdate(
//             id,
//             { fullName, phone, email, categoryId, unitId },
//             { new: true }
//         )

//         if (!interested) {
//             return next(new Error("Interest record not found", { cause: 404 }))
//         }

//         res.status(200).json({ message: "Updated successfully", interested })
//     } catch (error) {
//         next(error)
//     }
// }

// // Delete interested entry
// export const deleteInterested = async (req, res, next) => {
//     try {
//         const { id } = req.params
//         const interested = await interstedModel.findByIdAndDelete(id)

//         if (!interested) {
//             return next(new Error("Interest record not found", { cause: 404 }))
//         }

//         res.status(200).json({ message: "Deleted successfully" })
//     } catch (error) {
//         next(error)
//     }
// }
