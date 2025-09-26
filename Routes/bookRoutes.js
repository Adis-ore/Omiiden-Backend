import express from "express";
import { createBook } from "../Controllers/bookController.js";

const router = express.Router();

// POST /api/book
router.post("/", createBook);

export default router;
