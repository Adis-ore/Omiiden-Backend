import express from "express";
import { createEvent, getEvents } from "../Controllers/eventController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/", adminAuth, createEvent); 
router.get("/", getEvents); 

export default router;
