import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectSupabase } from "./Config/supabase.js";


dotenv.config();


const app = express();
const PORT = process.env.PORT || 4000;



import contactRoutes from "./Routes/contactRoutes.js";
import bookRoutes from "./Routes/bookRoutes.js";

import eventRoutes from "./Routes/eventRoutes.js";
import galleryRoutes from "./Routes/galleryRoutes.js";

// Removed empty app.use()

app.use(cors());
app.use(express.json({ limit: '10mb' })); // or higher if needed
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use("/api/contact", contactRoutes);
app.use("/api/book", bookRoutes);

app.use("/api/events", eventRoutes);
app.use("/api/gallery", galleryRoutes);

app.use(express.json());


const startServer = async () => {
  await connectSupabase(); 

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
