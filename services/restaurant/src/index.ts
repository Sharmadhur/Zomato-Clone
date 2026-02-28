import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import restaurantRoutes from "./routes/restaurant.js";
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());


const PORT = Number(process.env.PORT) || 5001;

app.use("/api/restaurant", restaurantRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Restaurant service is running on port ${PORT}`);
  connectDB();
});
