import pool from "../db.js";

export const getAllPosts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, content, author, created_at, updated_at FROM posts ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    res.status(500).json({ error: "Failed to retrieve posts" });
  }
};

export const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, title, content, author, created_at, updated_at FROM posts WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching post by ID:", err.message);
    res.status(500).json({ error: "Failed to retrieve post" });
  }
};

export const createPost = async (req, res) => {
  const { title, content, author } = req.body;
  if (!title || title.trim() === "" || !content || content.trim() === "") {
    return res.status(400).json({ error: "Title and content cannot be empty" });
  }
  // Use a default author if not provided
  const postAuthor =
    author && author.trim() !== "" ? author.trim() : "Anonymous";

  try {
    const result = await pool.query(
      "INSERT INTO posts (title, content, author) VALUES ($1, $2, $3) RETURNING *",
      [title, content, postAuthor]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating post:", err.message);
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, author } = req.body;

  if (title === undefined && content === undefined && author === undefined) {
    return res.status(400).json({ error: "No fields provided for update" });
  }

  let queryText = "UPDATE posts SET updated_at = NOW()";
  const queryParams = [];
  let paramIndex = 1;

  if (title !== undefined) {
    queryText += `, title = $${paramIndex}`;
    queryParams.push(title);
    paramIndex++;
  }
  if (content !== undefined) {
    queryText += `, content = $${paramIndex}`;
    queryParams.push(content);
    paramIndex++;
  }
  if (author !== undefined) {
    // NEW: Handle author update
    queryText += `, author = $${paramIndex}`;
    queryParams.push(author.trim() !== "" ? author.trim() : "Anonymous"); // Allow updating to default
    paramIndex++;
  }

  queryText += ` WHERE id = $${paramIndex} RETURNING id, title, content, author, created_at, updated_at`;
  queryParams.push(id);

  try {
    const result = await pool.query(queryText, queryParams);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating post:", err.message);
    res.status(500).json({ error: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res
      .status(200)
      .json({ message: "Post deleted successfully", id: result.rows[0].id });
  } catch (err) {
    console.error("Error deleting post:", err.message);
    res.status(500).json({ error: "Failed to delete post" });
  }
};