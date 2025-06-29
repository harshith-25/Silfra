import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated }) {
	if (!isAuthenticated) {
		return <Navigate to="/admin/login" replace />;
	}
	return <Outlet />;
}

export default ProtectedRoute;