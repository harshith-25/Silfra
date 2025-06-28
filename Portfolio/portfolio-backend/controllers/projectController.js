import pool from "../db.js";

export const getAllProjects = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM projects ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching projects:", err.message);
    res.status(500).json({ error: "Failed to retrieve projects" });
  }
};

export const getProjectById = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "Valid project ID is required" });
  }

  try {
    const result = await pool.query("SELECT * FROM projects WHERE id = $1", [
      parseInt(id),
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching project by ID:", err.message);
    res.status(500).json({ error: "Failed to retrieve project" });
  }
};

export const createProject = async (req, res) => {
  try {
    console.log("Received request body:", req.body); // Debug log

    const { title, description, technologies, imageUrl, liveLink, githubLink } =
      req.body;

    // Enhanced validation
    if (!title || typeof title !== "string" || !title.trim()) {
      return res
        .status(400)
        .json({ error: "Title is required and must be a non-empty string" });
    }

    if (
      !description ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        error: "Description is required and must be a non-empty string",
      });
    }

    // Clean and prepare data
    const cleanData = {
      title: title.trim(),
      description: description.trim(),
      technologies: technologies ? technologies.trim() : "",
      imageUrl: imageUrl ? imageUrl.trim() : "",
      liveLink: liveLink ? liveLink.trim() : "",
      githubLink: githubLink ? githubLink.trim() : "",
    };

    console.log("Clean data for insertion:", cleanData); // Debug log

    const result = await pool.query(
      "INSERT INTO projects (title, description, technologies, imageUrl, liveLink, githubLink) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        cleanData.title,
        cleanData.description,
        cleanData.technologies,
        cleanData.imageUrl,
        cleanData.liveLink,
        cleanData.githubLink,
      ]
    );

    console.log("Database insertion result:", result.rows[0]); // Debug log
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating project:", err.message);
    res
      .status(500)
      .json({ error: "Failed to create project", details: err.message });
  }
};

export const updateProject = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "Valid project ID is required" });
  }

  try {
    console.log("Received update request body:", req.body); // Debug log

    const { title, description, technologies, imageUrl, liveLink, githubLink } =
      req.body;

    // Build dynamic query
    let queryText = "UPDATE projects SET updated_at = CURRENT_TIMESTAMP";
    const queryParams = [];
    let paramIndex = 1;

    if (title !== undefined && title !== null) {
      if (typeof title !== "string" || !title.trim()) {
        return res
          .status(400)
          .json({ error: "Title must be a non-empty string" });
      }
      queryText += `, title = $${paramIndex}`;
      queryParams.push(title.trim());
      paramIndex++;
    }

    if (description !== undefined && description !== null) {
      if (typeof description !== "string" || !description.trim()) {
        return res
          .status(400)
          .json({ error: "Description must be a non-empty string" });
      }
      queryText += `, description = $${paramIndex}`;
      queryParams.push(description.trim());
      paramIndex++;
    }

    if (technologies !== undefined && technologies !== null) {
      queryText += `, technologies = $${paramIndex}`;
      queryParams.push(
        typeof technologies === "string" ? technologies.trim() : ""
      );
      paramIndex++;
    }

    if (imageUrl !== undefined && imageUrl !== null) {
      queryText += `, imageUrl = $${paramIndex}`;
      queryParams.push(typeof imageUrl === "string" ? imageUrl.trim() : "");
      paramIndex++;
    }

    if (liveLink !== undefined && liveLink !== null) {
      queryText += `, liveLink = $${paramIndex}`;
      queryParams.push(typeof liveLink === "string" ? liveLink.trim() : "");
      paramIndex++;
    }

    if (githubLink !== undefined && githubLink !== null) {
      queryText += `, githubLink = $${paramIndex}`;
      queryParams.push(typeof githubLink === "string" ? githubLink.trim() : "");
      paramIndex++;
    }

    queryText += ` WHERE id = $${paramIndex} RETURNING *`;
    queryParams.push(parseInt(id));

    console.log("Update query:", queryText, queryParams); // Debug log

    const result = await pool.query(queryText, queryParams);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    console.log("Update result:", result.rows[0]); // Debug log
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating project:", err.message);
    res
      .status(500)
      .json({ error: "Failed to update project", details: err.message });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "Valid project ID is required" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM projects WHERE id = $1 RETURNING id",
      [parseInt(id)]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    res
      .status(200)
      .json({ message: "Project deleted successfully", id: result.rows[0].id });
  } catch (err) {
    console.error("Error deleting project:", err.message);
    res
      .status(500)
      .json({ error: "Failed to delete project", details: err.message });
  }
};