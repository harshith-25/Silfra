import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage'; // Changed from AdminLogin
import AdminDashboard from './pages/AdminDashboard';
import ManageProjects from './pages/ManageProjects';
import ManageSkills from './pages/ManageSkills';
import ViewMessages from './pages/ViewMessages';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Footer from './components/Footer';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-app">Loading application...</div>;
  }

  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin/login" element={<AuthPage />} /> {/* Changed path to AuthPage */}

          {/* Protected Routes for Admin */}
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/projects" element={<ManageProjects />} />
            <Route path="/admin/skills" element={<ManageSkills />} />
            <Route path="/admin/messages" element={<ViewMessages />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;