import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, updatePost } from '../api';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const post = await getPost(id);
      const postData = {
        title: post.title,
        content: post.content,
        author: post.author
      };
      setFormData(postData);
      setOriginalData(postData);
    } catch (err) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    // Check if anything has changed
    const hasChanges = Object.keys(formData).some(
      key => formData[key].trim() !== originalData[key].trim()
    );

    if (!hasChanges) {
      navigate(`/post/${id}`);
      return;
    }

    setSaving(true);
    setError('');

    try {
      const updateData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        author: formData.author.trim() || 'Anonymous'
      };

      await updatePost(id, updateData);
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    const hasChanges = Object.keys(formData).some(
      key => formData[key].trim() !== originalData[key].trim()
    );

    if (hasChanges) {
      if (window.confirm('Are you sure you want to cancel? Your changes will be lost.')) {
        navigate(`/post/${id}`);
      }
    } else {
      navigate(`/post/${id}`);
    }
  };

  if (loading) return <div className="loading">Loading post...</div>;
  if (error && !formData.title) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <div className="edit-post-page">
        <h2>Edit Post</h2>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter post title"
              className="form-input"
              disabled={saving}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Your name"
              className="form-input"
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Write your post content here..."
              className="form-textarea"
              rows="10"
              disabled={saving}
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;