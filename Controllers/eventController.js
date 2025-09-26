import cloudinary from "cloudinary";
import { supabase } from "../Config/supabase.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Event
export const createEvent = async (req, res) => {
  console.log("Incoming request body:", req.body);

  const { 
    title, 
    description, 
    date, 
    time, 
    end_time, 
    location, 
    address, 
    type, 
    highlights, 
    featured, 
    status, 
    email, 
    password 
  } = req.body;

  let image_url = req.body.image_url;

  // Admin auth
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    console.warn("Unauthorized attempt with email:", email);
    return res.status(401).json({ error: "Unauthorized: Invalid admin credentials" });
  }

  // Cloudinary upload if base64
  if (image_url && image_url.startsWith("data:")) {
    try {
      console.log("Uploading image to Cloudinary...");
      const uploadRes = await cloudinary.v2.uploader.upload(image_url, { folder: "events" });
      image_url = uploadRes.secure_url;
      console.log("Cloudinary upload success:", image_url);
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return res.status(500).json({ error: "Image upload failed", details: err.message });
    }
  }

  try {
    console.log("Inserting into Supabase...");
    const { data, error } = await supabase
      .from("Events")
      .insert([
        { 
          title, 
          description, 
          date, 
          time, 
          end_time, 
          location, 
          address, 
          type, 
          highlights, 
          featured, 
          status, 
          image_url 
        }
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(400).json({ error: error.message });
    }

    console.log("Event created successfully:", data);
    res.status(201).json({ message: "Event created", data });

  } catch (err) {
    console.error("Server error in createEvent:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Get Events
export const getEvents = async (req, res) => {
  try {
    console.log("Fetching events from Supabase...");
    const { data, error } = await supabase
      .from("Events")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return res.status(400).json({ error: error.message });
    }

    console.log("Events fetched:", data.length);
    res.status(200).json({ events: data });

  } catch (err) {
    console.error("Server error in getEvents:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
