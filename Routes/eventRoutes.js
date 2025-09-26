import express from "express";
import { createEvent, getEvents, deleteEvent } from "../Controllers/eventController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/", adminAuth, createEvent); 
router.get("/", getEvents); 
router.delete("/:id", adminAuth, deleteEvent);


export default router;
