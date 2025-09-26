import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectSupabase } from "./Config/supabase.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "https://omiiden-admin.vercel.app",
  "https://omiiden.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("Blocked by CORS:", origin);
        callback(null, false);
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

import contactRoutes from "./Routes/contactRoutes.js";
import bookRoutes from "./Routes/bookRoutes.js";
import eventRoutes from "./Routes/eventRoutes.js";
import galleryRoutes from "./Routes/galleryRoutes.js";

app.use("/api/contact", contactRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/gallery", galleryRoutes);

app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

const startServer = async () => {
  await connectSupabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
