import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api';

const CreatePostPage = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		title: '',
		content: '',
		author: ''
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

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

		setLoading(true);
		setError('');

		try {
			const postData = {
				title: formData.title.trim(),
				content: formData.content.trim(),
				author: formData.author.trim() || 'Anonymous'
			};

			const newPost = await createPost(postData);
			navigate(`/post/${newPost.id}`);
		} catch (err) {
			setError(err.message || 'Failed to create post');
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		if (window.confirm('Are you sure you want to cancel? Your changes will be lost.')) {
			navigate('/');
		}
	};

	return (
		<div className="container">
			<div className="create-post-page">
				<h2>Create New Post</h2>

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
							disabled={loading}
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
							placeholder="Your name (optional)"
							className="form-input"
							disabled={loading}
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
							disabled={loading}
							required
						/>
					</div>

					<div className="form-actions">
						<button
							type="button"
							onClick={handleCancel}
							className="btn btn-secondary"
							disabled={loading}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="btn btn-primary"
							disabled={loading}
						>
							{loading ? 'Creating...' : 'Create Post'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreatePostPage;