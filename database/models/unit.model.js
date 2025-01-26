import mongoose, { Schema } from "mongoose";

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
    bedrooms:{
        type: Number,
        required: true
    },
    images: [
        {
          secure_url: {
            type: String,
            required: true,
          },
          public_id: {
            type: String,
            required: true,
          },
        },
      ],
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
    customId:String,
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'Admin'
    }

},{timestamps:true})

export const Unit = mongoose.model("Unit", unitSchema);