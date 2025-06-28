import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, signupUser } from '../api/auth'; // Import signupUser
import { useAuth } from '../hooks/useAuth';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';

function AuthPage() { // Renamed component
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // For signup
  const [isLoginMode, setIsLoginMode] = useState(true); // Toggle between login/signup
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (isLoginMode) {
      // Login Logic
      try {
        const data = await loginUser({ username, password });
        login(data.token);
        navigate('/admin/dashboard');
      } catch (err) {
        setError(err.message || "Login failed. Please check your credentials.");
        setModalTitle("Login Error");
        setModalMessage(err.message || "Invalid username or password. Please try again.");
        setIsModalOpen(true);
        console.error("Login attempt error:", err);
      }
    } else {
      // Signup Logic
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setModalTitle("Signup Error");
        setModalMessage("The passwords entered do not match. Please try again.");
        setIsModalOpen(true);
        return;
      }

      try {
        const data = await signupUser({ username, password });
        login(data.token); // Automatically log in after signup
        setModalTitle("Signup Successful!");
        setModalMessage("Your account has been created and you are now logged in.");
        setIsModalOpen(true);
        navigate('/admin/dashboard');
      } catch (err) {
        setError(err.message || "Signup failed. Please try again.");
        setModalTitle("Signup Error");
        setModalMessage(err.message || "Failed to create account. Username might already exist.");
        setIsModalOpen(true);
        console.error("Signup attempt error:", err);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null); // Clear error when modal closes
    setModalTitle('');
    setModalMessage('');
  };

  return (
    <div className="auth-container">
      <h2>{isLoginMode ? 'Admin Login' : 'Admin Sign Up'}</h2>
      <form onSubmit={handleAuthSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isLoginMode ? "current-password" : "new-password"}
          />
        </div>
        {!isLoginMode && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
        )}
        <button type="submit" className="login-button">
          {isLoginMode ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <div className="auth-toggle">
        {isLoginMode ? (
          <p>
            Don't have an account?{' '}
            <button type="button" onClick={() => setIsLoginMode(false)} className="toggle-button">
              Sign Up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button type="button" onClick={() => setIsLoginMode(true)} className="toggle-button">
              Login
            </button>
          </p>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        <ErrorMessage message={error} />
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
}

export default AuthPage;