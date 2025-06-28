import pg from "pg";
import dotenv from "dotenv";
// import bcrypt from 'bcrypt'; // No longer needed for initial admin, but keep if bcrypt is used elsewhere

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
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
      );
    `);
    console.log("Users table checked/created successfully.");

    // // --- REMOVE THIS SECTION ---
    // // Insert default admin user if not exists
    // const adminUsername = 'admin';
    // const adminPassword = 'password123'; // Default password
    //
    // const userCheck = await client.query('SELECT * FROM users WHERE username = $1', [adminUsername]);
    // if (userCheck.rows.length === 0) {
    //   const hashedPassword = await bcrypt.hash(adminPassword, 10); // Hash password
    //   await client.query(
    //     'INSERT INTO users (username, password) VALUES ($1, $2)',
    //     [adminUsername, hashedPassword]
    //   );
    //   console.log('Default admin user created.');
    // } else {
    //   console.log('Admin user already exists.');
    // }
    // // --- END REMOVE SECTION ---

    // Create projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          technologies VARCHAR(255),
          imageUrl VARCHAR(255),
          liveLink VARCHAR(255),
          githubLink VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Projects table checked/created successfully.");

    // Create skills table
    await client.query(`
      CREATE TABLE IF NOT EXISTS skills (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) UNIQUE NOT NULL,
          proficiency VARCHAR(50) NOT NULL
      );
    `);
    console.log("Skills table checked/created successfully.");

    // Create messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          senderName VARCHAR(100) NOT NULL,
          senderEmail VARCHAR(100) NOT NULL,
          subject VARCHAR(255),
          message TEXT NOT NULL,
          sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Messages table checked/created successfully.");
  } catch (err) {
    console.error("Error initializing database:", err.stack);
    process.exit(1);
  } finally {
    client.release();
  }
}

export default pool;