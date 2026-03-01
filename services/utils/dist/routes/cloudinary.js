"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const router = express_1.default.Router();
router.post("/upload", async (req, res) => {
    try {
        console.log("Received upload request, buffer exists:", !!req.body.buffer);
        const { buffer } = req.body;
        const result = await cloudinary_1.default.v2.uploader.upload(buffer, {
            resource_type: "image", // safer than "auto"
        });
        console.log("Upload success:", result.secure_url);
        res.json({ url: result.secure_url });
    }
    catch (err) {
        console.error("Cloudinary REAL error:", err);
        res.status(500).json({
            message: "Cloudinary upload failed",
            error: err.message,
        });
    }
});
exports.default = router;
