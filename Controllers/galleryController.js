import { supabase } from "../Config/supabase.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a gallery item
export const createGalleryItem = async (req, res) => {
  console.log("Incoming request body:", req.body);

  const {
    type,
    category,
    description,
    date,
    location,
    image,
    duration,
    featured,
    highlights,
    email,
    password,
  } = req.body;

  let image_url = image;
  const safeDuration = duration || "N/A"; // fallback if duration not provided

  // Admin auth
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    console.error("Unauthorized attempt with email:", email);
    return res.status(401).json({ error: "Unauthorized: Invalid admin credentials" });
  }

  // Cloudinary upload if base64
  if (image_url && image_url.startsWith("data:")) {
    console.log("Uploading image to Cloudinary...");
    try {
      const uploadRes = await cloudinary.v2.uploader.upload(image_url, { folder: "gallery" });
      console.log("Cloudinary upload success:", uploadRes.secure_url);
      image_url = uploadRes.secure_url;
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return res.status(500).json({ error: "Image upload failed", details: err.message });
    }
  }

  try {
    console.log("Inserting into Supabase:", {
      type,
      category,
      description,
      date,
      location,
      image_url,
      duration: safeDuration,
      featured,
      highlights,
    });

    const { data, error } = await supabase
      .from("Gallery")
      .insert([
        {
          type,
          category,
          description,
          date,
          location,
          image_url,
          duration: safeDuration,
          featured,
          highlights,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(400).json({ error: error.message });
    }

    console.log("Insert success:", data);
    res.status(201).json({ message: "Gallery item created", data });
  } catch (err) {
    console.error("Server crash:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Get all gallery items
export const getGallery = async (req, res) => {
  try {
    console.log("Fetching gallery items...");
    const { data, error } = await supabase
      .from("Gallery")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return res.status(400).json({ error: error.message });
    }

    console.log("Fetched gallery items:", data.length);
    res.status(200).json({ gallery: data });
  } catch (err) {
    console.error("Server crash:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
