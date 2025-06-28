const API_BASE_URL = "http://localhost:7000/api/projects";

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

export const getProjects = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }
};

export const createProject = async (projectData) => {
  try {
    console.log("Sending project data:", projectData); // Debug log

    // Validate data before sending
    if (!projectData.title || !projectData.title.trim()) {
      throw new Error("Project title is required");
    }
    if (!projectData.description || !projectData.description.trim()) {
      throw new Error("Project description is required");
    }

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });

    console.log("Response status:", response.status); // Debug log
    console.log("Response headers:", response.headers); // Debug log

    return await handleResponse(response);
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error(`Failed to create project: ${error.message}`);
  }
};

export const updateProject = async (id, projectData) => {
  try {
    if (!id) {
      throw new Error("Project ID is required for update");
    }

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error updating project ${id}:`, error);
    throw new Error(`Failed to update project: ${error.message}`);
  }
};

export const deleteProject = async (id) => {
  try {
    if (!id) {
      throw new Error("Project ID is required for deletion");
    }

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error deleting project ${id}:`, error);
    throw new Error(`Failed to delete project: ${error.message}`);
  }
};

export const getProjectById = async (id) => {
  try {
    if (!id) {
      throw new Error("Project ID is required");
    }

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    throw new Error(`Failed to fetch project: ${error.message}`);
  }
};