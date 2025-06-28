import React, { useState, useEffect } from 'react';
import './App.css';
import { fetchTodos, addTodo, toggleTodo, updateTodo, deleteTodo } from './api'; // Import all API functions

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for inline editing
  const [editingTodoId, setEditingTodoId] = useState(null); // ID of the todo currently being edited
  const [editingTodoDescription, setEditingTodoDescription] = useState(''); // Value of the edit input field

  useEffect(() => {
    const loadTodos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchTodos(filter);
        setTodos(data);
      } catch (err) {
        setError("Failed to load todos. Please try again.");
        console.error("Error in App.jsx fetchTodos:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadTodos();
  }, [filter]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    const trimmedTodo = newTodo.trim();
    if (!trimmedTodo) return;

    setError(null);
    try {
      const addedTodo = await addTodo(trimmedTodo);
      setTodos([addedTodo, ...todos]);
      setNewTodo('');
      if (filter === 'completed') { // If we add a new active todo while on 'completed' filter, switch to 'all'
        setFilter('all');
      }
    } catch (err) {
      setError("Failed to add todo. Please try again.");
      console.error("Error in App.jsx addTodo:", err);
    }
  };

  const handleToggleTodo = async (id, currentCompleted) => {
    setError(null);
    try {
      const updatedTodo = await toggleTodo(id, currentCompleted); // Use the imported toggleTodo
      setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
    } catch (err) {
      setError("Failed to update todo status. Please try again.");
      console.error("Error in App.jsx toggleTodo:", err);
    }
  };

  const handleDeleteTodo = async (id) => {
    setError(null);
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError("Failed to delete todo. Please try again.");
      console.error("Error in App.jsx deleteTodo:", err);
    }
  };

  // --- Inline Edit Handlers ---
  const handleEditClick = (todo) => {
    setEditingTodoId(todo.id);
    setEditingTodoDescription(todo.description);
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditingTodoDescription('');
  };

  const handleSaveEdit = async (id) => {
    const trimmedDescription = editingTodoDescription.trim();
    if (!trimmedDescription) {
      setError("Description cannot be empty!");
      return;
    }

    setError(null);
    try {
      const updatedTodo = await updateTodo(id, { description: trimmedDescription }); // Use updateTodo
      setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
      setEditingTodoId(null); // Exit edit mode
      setEditingTodoDescription(''); // Clear edit input
    } catch (err) {
      setError("Failed to update todo description. Please try again.");
      console.error("Error in App.jsx updateTodo:", err);
    }
  };

  const handleEditInputChange = (e) => {
    setEditingTodoDescription(e.target.value);
  };

  // Handle Enter key to save edit
  const handleEditInputKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      handleSaveEdit(id);
    }
  };

  return (
    <div className="todo-app-container">
      <h1>My To-Do List</h1>

      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          aria-label="New todo description"
        />
        <button type="submit" className="add-button">Add Todo</button>
      </form>

      <div className="filter-buttons">
        <button
          className={filter === 'all' ? 'active-filter' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'active' ? 'active-filter' : ''}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={filter === 'completed' ? 'active-filter' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {isLoading && <p className="loading-message">Loading todos...</p>}
      {error && <p className="error-message">{error}</p>}

      {!isLoading && !error && (
        <ul className="todo-list">
          {todos.length === 0 ? (
            <li className="no-todos-message">No todos found for this filter.</li>
          ) : (
            todos.map((todo) => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <div className="todo-main-content">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id, todo.completed)}
                    className="todo-checkbox"
                    aria-label={`Mark "${todo.description}" as complete`}
                  />
                  {editingTodoId === todo.id ? (
                    <input
                      type="text"
                      value={editingTodoDescription}
                      onChange={handleEditInputChange}
                      onKeyPress={(e) => handleEditInputKeyPress(e, todo.id)}
                      className="edit-todo-input"
                      autoFocus // Focus the input when it appears
                      onBlur={() => handleSaveEdit(todo.id)} // Save on blur (optional)
                      aria-label={`Edit description for "${todo.description}"`}
                    />
                  ) : (
                    <span
                      className="todo-description"
                    // No direct click to toggle on span anymore, checkbox handles it
                    >
                      {todo.description}
                    </span>
                  )}
                </div>
                <div className="todo-actions">
                  {editingTodoId === todo.id ? (
                    <>
                      <button className="save-button" onClick={() => handleSaveEdit(todo.id)}>
                        Save
                      </button>
                      <button className="cancel-button" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button className="edit-button" onClick={() => handleEditClick(todo)}>
                      Edit
                    </button>
                  )}
                  <button className="delete-button" onClick={() => handleDeleteTodo(todo.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default App;