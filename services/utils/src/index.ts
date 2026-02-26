import express from 'express'
// import connectDB from './config/db.js';
import dotenv from "dotenv"
import cloudinary from "cloudinary";

dotenv.config();

const app = express();

const { CLOUD_NAME , CLOUD_API_KEY , CLOUD_SECRET_KEY} = process.env;

if(!CLOUD_NAME || !CLOUD_API_KEY || !CLOUD_SECRET_KEY){
    throw new Error("Missing Cloudinary environment variables");
}

cloudinary.v2.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_SECRET_KEY,
});


const PORT = Number(process.env.PORT) || 5002;


app.listen(PORT, "0.0.0.0", () => {
    console.log(`Utils service is running on port ${PORT}`);

});