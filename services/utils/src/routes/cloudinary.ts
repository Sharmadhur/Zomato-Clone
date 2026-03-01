import express from "express";
import cloudinary from "cloudinary";

const router = express.Router();

router.post("/upload", async (req, res) => {
  try {
    console.log("Received upload request, buffer exists:", !!req.body.buffer);

    const { buffer } = req.body;

    const result = await cloudinary.v2.uploader.upload(buffer, {
      resource_type: "image", // safer than "auto"
    });

    console.log("Upload success:", result.secure_url);

    res.json({ url: result.secure_url });
  } catch (err: any) {
    console.error("Cloudinary REAL error:", err);
    res.status(500).json({
      message: "Cloudinary upload failed",
      error: err.message,
    });
  }
});

export default router;