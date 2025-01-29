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
    coordinates: { // ^ for GPS
        latitude: {
            type: Number,
            required: true
        },                          
        longitude: {
            type: Number,
            required: true
        }
    },
    nearbyPlaces: [
        {
          place: { type: String, required: true },  
          timeInMinutes: { type: Number, required: true }
        }
      ],
    customId:String,
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'Admin'
    }
},{timestamps:true})

export const Unit = mongoose.model("Unit", unitSchema);

// vukq pvks zgtf cjmf

{/* <iframe
  title="Unit Location"
  width="100%"
  height="100%"
  style="border: 0;"
  src="https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=37.7749,-122.4194&zoom=14"
  allowfullscreen>
</iframe> */}
