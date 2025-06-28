import pool from "../db.js";

export const getAllSkills = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM skills ORDER BY name ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching skills:", err.message);
    res.status(500).json({ error: "Failed to retrieve skills" });
  }
};

export const getSkillById = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "Valid skill ID is required" });
  }

  try {
    const result = await pool.query("SELECT * FROM skills WHERE id = $1", [
      parseInt(id),
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Skill not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching skill by ID:", err.message);
    res.status(500).json({ error: "Failed to retrieve skill" });
  }
};

export const createSkill = async (req, res) => {
  try {
    console.log("Received skill request body:", req.body); // Debug log

    const { name, proficiency } = req.body;

    // Enhanced validation
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        error: "Skill name is required and must be a non-empty string",
      });
    }

    if (
      !proficiency ||
      typeof proficiency !== "string" ||
      !proficiency.trim()
    ) {
      return res.status(400).json({
        error: "Proficiency is required and must be a non-empty string",
      });
    }

    // Validate proficiency level
    const validProficiencies = [
      "Beginner",
      "Intermediate",
      "Advanced",
      "Expert",
    ];
    if (!validProficiencies.includes(proficiency)) {
      return res.status(400).json({
        error:
          "Proficiency must be one of: Beginner, Intermediate, Advanced, Expert",
      });
    }

    // Clean and prepare data
    const cleanData = {
      name: name.trim(),
      proficiency: proficiency.trim(),
    };

    console.log("Clean skill data for insertion:", cleanData); // Debug log

    // Check for duplicate skill names (case-insensitive)
    const existingSkill = await pool.query(
      "SELECT id FROM skills WHERE LOWER(name) = LOWER($1)",
      [cleanData.name]
    );

    if (existingSkill.rows.length > 0) {
      return res.status(409).json({
        error: "A skill with this name already exists",
      });
    }

    const result = await pool.query(
      "INSERT INTO skills (name, proficiency) VALUES ($1, $2) RETURNING *",
      [cleanData.name, cleanData.proficiency]
    );

    console.log("Database insertion result:", result.rows[0]); // Debug log
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating skill:", err.message);
    res.status(500).json({
      error: "Failed to create skill",
      details: err.message,
    });
  }
};

export const updateSkill = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "Valid skill ID is required" });
  }

  try {
    console.log("Received skill update request body:", req.body); // Debug log

    const { name, proficiency } = req.body;

    // Build dynamic query
    let queryText = "UPDATE skills SET updated_at = CURRENT_TIMESTAMP";
    const queryParams = [];
    let paramIndex = 1;

    if (name !== undefined && name !== null) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          error: "Skill name must be a non-empty string",
        });
      }

      // Check for duplicate skill names (case-insensitive), excluding current skill
      const existingSkill = await pool.query(
        "SELECT id FROM skills WHERE LOWER(name) = LOWER($1) AND id != $2",
        [name.trim(), parseInt(id)]
      );

      if (existingSkill.rows.length > 0) {
        return res.status(409).json({
          error: "A skill with this name already exists",
        });
      }

      queryText += `, name = $${paramIndex}`;
      queryParams.push(name.trim());
      paramIndex++;
    }

    if (proficiency !== undefined && proficiency !== null) {
      if (typeof proficiency !== "string" || !proficiency.trim()) {
        return res.status(400).json({
          error: "Proficiency must be a non-empty string",
        });
      }

      // Validate proficiency level
      const validProficiencies = [
        "Beginner",
        "Intermediate",
        "Advanced",
        "Expert",
      ];
      if (!validProficiencies.includes(proficiency)) {
        return res.status(400).json({
          error:
            "Proficiency must be one of: Beginner, Intermediate, Advanced, Expert",
        });
      }

      queryText += `, proficiency = $${paramIndex}`;
      queryParams.push(proficiency.trim());
      paramIndex++;
    }

    // If no fields to update
    if (queryParams.length === 0) {
      return res.status(400).json({
        error:
          "At least one field (name or proficiency) must be provided for update",
      });
    }

    queryText += ` WHERE id = $${paramIndex} RETURNING *`;
    queryParams.push(parseInt(id));

    console.log("Update query:", queryText, queryParams); // Debug log

    const result = await pool.query(queryText, queryParams);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Skill not found" });
    }

    console.log("Update result:", result.rows[0]); // Debug log
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating skill:", err.message);
    res.status(500).json({
      error: "Failed to update skill",
      details: err.message,
    });
  }
};

export const deleteSkill = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "Valid skill ID is required" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM skills WHERE id = $1 RETURNING id, name",
      [parseInt(id)]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Skill not found" });
    }
    res.status(200).json({
      message: "Skill deleted successfully",
      deletedSkill: result.rows[0],
    });
  } catch (err) {
    console.error("Error deleting skill:", err.message);
    res.status(500).json({
      error: "Failed to delete skill",
      details: err.message,
    });
  }
};