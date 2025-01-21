import mongoose from "mongoose";
import { config } from 'dotenv'

import path from 'path'
config({path: path.resolve('./config/.env')})

import color from "@colors/colors"

export const dbConnection = mongoose.connect(
  process.env.MONGO_URL,
).then(()=>{
    console.log('Database connected successfully'.bgGreen); 
}).catch((err)=>{
    console.error('Error connecting to database:'.bgRed, err);
});
