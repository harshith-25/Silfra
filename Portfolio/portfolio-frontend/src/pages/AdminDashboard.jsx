import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function AdminDashboard() {
  const { user } = useAuth(); // Get user info from context

  return (
    <div className="admin-dashboard">
      <h2>Welcome to Admin Dashboard, {user?.username}!</h2>
      <p>Manage your portfolio content here.</p>

      <nav className="admin-nav-grid">
        <Link to="/admin/projects" className="admin-nav-item">
          <h3>Manage Projects</h3>
          <p>Add, edit, or delete your portfolio projects.</p>
        </Link>
        <Link to="/admin/skills" className="admin-nav-item">
          <h3>Manage Skills</h3>
          <p>Update your technical skills and proficiencies.</p>
        </Link>
        <Link to="/admin/messages" className="admin-nav-item">
          <h3>View Messages</h3>
          <p>Read messages submitted through the contact form.</p>
        </Link>
        {/* Add more admin links here if needed */}
      </nav>
    </div>
  );
}

export default AdminDashboard;