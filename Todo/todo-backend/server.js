import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Setup
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function createTodosTable() {
  const client = await pool.connect();
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        description VARCHAR(25) NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(createTableQuery);
    console.log("Todos table checked/created successfully.");
  } catch (err) {
    console.error("Error creating todos table:", err.stack);
    process.exit(1);
  } finally {
    client.release();
  }
}

(async () => {
  try {
    await pool.connect();
    console.log("Successfully connected to Neon PostgreSQL database!");
    await createTodosTable();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to database or create table:", err.stack);
    process.exit(1);
  }
})();

// --- API Routes ---

// GET / - Basic health check route
app.get("/", (req, res) => {
  res.send("To-Do Backend is operational!");
});

// GET /todos - Fetch all todos, or filter by status
app.get("/todos", async (req, res) => {
  const { status } = req.query;
  let queryText = "SELECT id, description, completed, created_at FROM todos";
  const queryParams = [];

  if (status === "active") {
    queryText += " WHERE completed = false";
  } else if (status === "completed") {
    queryText += " WHERE completed = true";
  }

  queryText += " ORDER BY created_at DESC";

  try {
    const result = await pool.query(queryText, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching todos:", err.message);
    res.status(500).json({ error: "Failed to retrieve todos" });
  }
});

// POST /todos - Add a new todo
app.post("/todos", async (req, res) => {
  const { description } = req.body;

  if (!description || description.trim() === "") {
    return res.status(400).json({ error: "Todo description cannot be empty" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO todos (description, completed) VALUES ($1, FALSE) RETURNING id, description, completed, created_at",
      [description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding todo:", err.message);
    res.status(500).json({ error: "Failed to add todo" });
  }
});

// PUT /todos/:id - Update an existing todo
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { description, completed } = req.body;

  if (description === undefined && completed === undefined) {
    return res.status(400).json({ error: "No fields provided for update" });
  }

  let queryText = "UPDATE todos SET ";
  const queryParams = [];
  let paramIndex = 1;

  if (description !== undefined) {
    queryText += `description = $${paramIndex}, `;
    queryParams.push(description);
    paramIndex++;
  }
  if (completed !== undefined) {
    queryText += `completed = $${paramIndex}, `;
    queryParams.push(completed);
    paramIndex++;
  }

  queryText = queryText.slice(0, -2); // Remove trailing comma and space
  queryText += ` WHERE id = $${paramIndex} RETURNING id, description, completed, created_at`;
  queryParams.push(id);

  try {
    const result = await pool.query(queryText, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating todo:", err.message);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// DELETE /todos/:id - Delete a todo
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res
      .status(200)
      .json({ message: "Todo deleted successfully", id: result.rows[0].id });
  } catch (err) {
    console.error("Error deleting todo:", err.message);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});
