import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoute from "./routes/auth.js";
import cors from "cors";

dotenv.config();

const app = express();

//Added on 21/02 to run Google signin as i was facing issue on GPT's recommendation
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"] // MUST include Authorization
  })
);


app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});



app.use(express.json());

app.use("/api/auth", authRoute);

const PORT = Number(process.env.PORT) || 5000;


app.listen(PORT, "0.0.0.0", () => {
    console.log(`Auth service is running on port ${PORT}`);
    connectDB();
});