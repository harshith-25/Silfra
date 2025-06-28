import pool from "../db.js";

export const submitMessage = async (req, res) => {
  const { senderName, senderEmail, subject, message } = req.body;
  if (!senderName || !senderEmail || !message) {
    return res
      .status(400)
      .json({ error: "Name, email, and message are required" });
  }
  try {
    const result = await pool.query(
      "INSERT INTO messages (senderName, senderEmail, subject, message) VALUES ($1, $2, $3, $4) RETURNING *",
      [senderName, senderEmail, subject, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error submitting message:", err.message);
    res.status(500).json({ error: "Failed to submit message" });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM messages ORDER BY sent_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching messages:", err.message);
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
};

export const deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM messages WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("Error deleting message:", err.message);
    res.status(500).json({ error: "Failed to delete message" });
  }
};