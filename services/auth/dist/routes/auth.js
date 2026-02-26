import express from "express";
import { addUserRole, loginUser, myProfile } from "../controllers/auth.js";
import { isAuth } from "../middlewares/isAuth.js";
const router = express.Router();
router.post("/login", loginUser);
router.put("/add/role", isAuth, addUserRole);
router.get("/me", isAuth, myProfile);
export default router;
// express → web framework
// addUserRole & loginUser → controller functions that handle the logic for specific routes
// isAuth → middleware to check if user is authenticated  
