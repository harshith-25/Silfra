import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../api';
import PostCard from '../components/PostCard';

const HomePage = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		fetchPosts();
	}, []);

	const fetchPosts = async () => {
		try {
			const data = await getPosts();
			setPosts(data);
		} catch (err) {
			setError('Failed to load posts');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <div className="loading">Loading posts...</div>;
	if (error) return <div className="error">{error}</div>;

	return (
		<div className="container">
			<div className="home-header">
				<h2>Latest Posts</h2>
				<p>Discover amazing stories and insights</p>
			</div>

			{posts.length === 0 ? (
				<div className="no-posts">
					<h3>No posts yet</h3>
					<p>Be the first to share your thoughts!</p>
					<Link to="/create" className="btn btn-primary">Create First Post</Link>
				</div>
			) : (
				<div className="posts-grid">
					{posts.map(post => (
						<PostCard key={post.id} post={post} />
					))}
				</div>
			)}
		</div>
	);
};

export default HomePage;