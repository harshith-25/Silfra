import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import { Routes, Route } from 'react-router-dom';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/edit/:id" element={<EditPostPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;