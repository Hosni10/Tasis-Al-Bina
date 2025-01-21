import mongoose from "mongoose";

const unitSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
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
        type: [String],
    },
    bedrooms:{
        type: Number,
        required: true
    },
    bathrooms:{
        type: Number,
        required: true
    },
    livingrooms:{
        type: Number,
        required: true
    },
    waterTank:{
        type: Boolean,
        required: true
    },
    floor:{
        type: Number,
        required: true
    },
    maidRoom:{
        type: Boolean,
        required: true
    },
    driverRoom:{
        type: Boolean,
        required: true
    },
    location:{
        type: String,
        required: true
    },
},{timestamps:true})

export const Unit = mongoose.model("Unit", unitSchema);