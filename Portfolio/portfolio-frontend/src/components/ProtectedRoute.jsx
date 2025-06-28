import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated }) {
	if (!isAuthenticated) {
		return <Navigate to="/admin/login" replace />;
	}
	return <Outlet />; // Render child routes if authenticated
}

export default ProtectedRoute;