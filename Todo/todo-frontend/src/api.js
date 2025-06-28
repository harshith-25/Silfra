const API_BASE_URL = "http://localhost:5000/todos";

export const fetchTodos = async (filter = "all") => {
  let url = API_BASE_URL;
  if (filter === "active") {
    url = `${API_BASE_URL}?status=active`;
  } else if (filter === "completed") {
    url = `${API_BASE_URL}?status=completed`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const addTodo = async (description) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const updateTodo = async (id, updates) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const toggleTodo = async (id, currentCompletedStatus) => {
  return updateTodo(id, { completed: !currentCompletedStatus });
};

export const deleteTodo = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};