import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Load Supabase credentials from .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and Key must be provided in .env file");
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);



// Function to test database connection with "Contact", "BOOK", and "Event" tables
const connectSupabase = async () => {
  try {
    // Test Contact table
    const { error: contactError } = await supabase.from("Contact").select("id").limit(1);
    if (contactError) throw new Error(`Contact table error: ${contactError.message}`);
    console.log("Connected to Contact table successfully");

    // Test BOOK table
    const { error: bookError } = await supabase.from("BOOK").select("id").limit(1);
    if (bookError) throw new Error(`BOOK table error: ${bookError.message}`);
    console.log("Connected to BOOK table successfully");

    // Test Event table
    const { error: eventError } = await supabase.from("Events").select("id").limit(1);
    if (eventError) throw new Error(`Event table error: ${eventError.message}`);
    console.log("Connected to Event table successfully");
  } catch (err) {
    console.error("Supabase connection failed:", err.message);
    process.exit(1);
  }
};

export { supabase, connectSupabase };
