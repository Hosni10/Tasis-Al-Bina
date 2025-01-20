import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config()

export const dbConnection = mongoose.connect(
  process.env.MONGO_URL,
).then(()=>{
    console.log('Database connected successfully');
}).catch((err)=>{
    console.error('Error connecting to database:', err);
});
