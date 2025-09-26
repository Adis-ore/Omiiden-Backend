import express from "express";
import { createGalleryItem, getGallery } from "../Controllers/galleryController.js";

const router = express.Router();

router.post("/", createGalleryItem); // Admin only
router.get("/", getGallery); // Public

export default router;
