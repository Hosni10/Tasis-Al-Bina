import mongoose from "mongoose";

const unitSchema = mongoose.Schema({
    type:{
        type: String,
        required: true
    },
    area:{
        type: Number,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    bedrooms:{
        type: Number,
        required: true
    },
    bathrooms:{
        type: Number,
        required: true
    }
})

export const Unit = mongoose.model("Unit", unitSchema);