import { supabase } from "../Config/supabase.js";

export const createContact = async (req, res) => {
	const { name, email, phone, subject, message } = req.body;
	try {
		const { data, error } = await supabase
			.from("Contact")
			.insert([{ name, email, phone, subject, message }])
			.select();
		if (error) {
			return res.status(400).json({ error: error.message });
		}
		res.status(201).json({ message: "Contact form submitted successfully", data });
	} catch (err) {
		res.status(500).json({ error: "Server error" });
	}
};
