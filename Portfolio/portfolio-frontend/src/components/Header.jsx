import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Header() {
	const { isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/admin/login');
	};

	return (
		<header className="site-header">
			<div className="header-content">
				<Link to="/" className="site-logo">Your Name</Link>
				<nav className="main-nav">
					<Link to="/" className="nav-item">Home</Link>
					<a href="#projects" className="nav-item">Projects</a>
					<a href="#skills" className="nav-item">Skills</a>
					<Link to="/contact" className="nav-item">Contact</Link>
					{isAuthenticated ? (
						<>
							<Link to="/admin/dashboard" className="nav-item admin-link">Admin Dashboard</Link>
							<button onClick={handleLogout} className="nav-item logout-button">Logout</button>
						</>
					) : (
						<Link to="/admin/login" className="nav-item login-link">Admin Login/Signup</Link>
					)}
				</nav>
			</div>
		</header>
	);
}

export default Header;