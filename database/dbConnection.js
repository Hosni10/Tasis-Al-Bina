import mongoose from "mongoose";
import { config } from 'dotenv'
import path from 'path'
config({path: path.resolve('./config/.env')})


export const dbConnection = mongoose.connect(
  process.env.MONGO_URL,
).then(()=>{
    console.log('Database connected successfully  ✔️  '.bgGreen);  
}).catch((err)=>{
    console.error('Error connecting to database:'.bgRed, err);
});
