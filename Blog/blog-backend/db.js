import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function initializeDb() {
  const client = await pool.connect();
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          author VARCHAR(100) DEFAULT 'Anonymous',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(createTableQuery);
    console.log("Posts table checked/created successfully."); // <--- Look for this message!
  } catch (err) {
    console.error("Error creating posts table:", err.stack);
    process.exit(1);
  } finally {
    client.release();
  }
}

export default pool;