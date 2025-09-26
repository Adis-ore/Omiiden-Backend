import { supabase } from "../Config/supabase.js";

export const createBook = async (req, res) => {
  const { name, email, phone, eventType, eventDate, eventTime, venue, guestCount, duration, message } = req.body;
  try {
    const { data, error } = await supabase
      .from("BOOK")
      .insert([
        { name, email, phone, eventType, eventDate, eventTime, venue, guestCount, duration, message }
      ])
      .select();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(201).json({ message: "Booking submitted successfully", data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
