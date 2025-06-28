const API_BASE_URL = "http://localhost:7000/api/skills";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // If response body is not JSON, use default error message
    }
    throw new Error(errorMessage);
  }

  // Check if response has content before parsing JSON
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  return null;
};

export const getSkills = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching skills:", error);
    throw new Error(`Failed to fetch skills: ${error.message}`);
  }
};

export const createSkill = async (skillData) => {
  try {
    console.log("Sending skill data:", skillData); // Debug log

    // Validate data before sending
    if (!skillData.name || !skillData.name.trim()) {
      throw new Error("Skill name is required");
    }
    if (!skillData.proficiency) {
      throw new Error("Proficiency level is required");
    }

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(skillData),
    });

    console.log("Response status:", response.status); // Debug log
    return await handleResponse(response);
  } catch (error) {
    console.error("Error creating skill:", error);
    throw new Error(`Failed to create skill: ${error.message}`);
  }
};

export const updateSkill = async (id, skillData) => {
  try {
    if (!id) {
      throw new Error("Skill ID is required for update");
    }

    console.log("Updating skill:", id, skillData); // Debug log

    // Validate data before sending
    if (!skillData.name || !skillData.name.trim()) {
      throw new Error("Skill name is required");
    }
    if (!skillData.proficiency) {
      throw new Error("Proficiency level is required");
    }

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(skillData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error(`Error updating skill ${id}:`, error);
    throw new Error(`Failed to update skill: ${error.message}`);
  }
};

export const deleteSkill = async (id) => {
  try {
    if (!id) {
      throw new Error("Skill ID is required for deletion");
    }

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error(`Error deleting skill ${id}:`, error);
    throw new Error(`Failed to delete skill: ${error.message}`);
  }
};

export const getSkillById = async (id) => {
  try {
    if (!id) {
      throw new Error("Skill ID is required");
    }

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error fetching skill ${id}:`, error);
    throw new Error(`Failed to fetch skill: ${error.message}`);
  }
};
