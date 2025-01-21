import mongoose, { now } from "mongoose";


const reservationSchema = mongoose.Schema({
    customerName:{
        type:String,
        required:true,
    },
    customerEmail:{
        type:String,
        required:true,
    },
    customerPhone:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default: Date.now,
        required:true,
    },
    unitId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Unit",
        required: true,
    }
})

export const Reservation = mongoose.model('Reservation', reservationSchema);