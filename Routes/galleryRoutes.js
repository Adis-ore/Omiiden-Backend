import express from "express";
import { createGalleryItem, getGallery, deleteGallery } from "../Controllers/galleryController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/", createGalleryItem); // Admin only
router.get("/", getGallery); // Public
router.delete("/:id", adminAuth, deleteGallery);

export default router;
