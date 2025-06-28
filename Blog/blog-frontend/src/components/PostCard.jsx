import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
	const [likes, setLikes] = useState(0);
	const [isLiked, setIsLiked] = useState(false);
	const [views, setViews] = useState(0);

	useEffect(() => {
		const savedLikes = JSON.parse(localStorage.getItem('postLikes') || '{}');
		const savedLikedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
		const savedViews = JSON.parse(localStorage.getItem('postViews') || '{}');

		setLikes(savedLikes[post.id] || 0);
		setIsLiked(savedLikedPosts.includes(post.id));
		setViews(savedViews[post.id] || 0);
	}, [post.id]);

	const handleLike = (e) => {
		e.preventDefault();
		const savedLikes = JSON.parse(localStorage.getItem('postLikes') || '{}');
		const savedLikedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');

		if (isLiked) {
			savedLikes[post.id] = Math.max(0, (savedLikes[post.id] || 0) - 1);
			const index = savedLikedPosts.indexOf(post.id);
			if (index > -1) savedLikedPosts.splice(index, 1);
		} else {
			savedLikes[post.id] = (savedLikes[post.id] || 0) + 1;
			savedLikedPosts.push(post.id);
		}

		localStorage.setItem('postLikes', JSON.stringify(savedLikes));
		localStorage.setItem('likedPosts', JSON.stringify(savedLikedPosts));

		setLikes(savedLikes[post.id]);
		setIsLiked(!isLiked);
	};

	const handleShare = (e) => {
		e.preventDefault();
		const url = `${window.location.origin}/post/${post.id}`;

		if (navigator.share) {
			navigator.share({
				title: post.title,
				text: post.content.substring(0, 100) + '...',
				url: url
			});
		} else {
			navigator.clipboard.writeText(url);
			alert('Link copied to clipboard!');
		}
	};

	const handleCardClick = () => {
		// Increment view count when card is clicked
		const savedViews = JSON.parse(localStorage.getItem('postViews') || '{}');
		savedViews[post.id] = (savedViews[post.id] || 0) + 1;
		localStorage.setItem('postViews', JSON.stringify(savedViews));
		setViews(savedViews[post.id]);
	};

	return (
		<div className="post-card">
			<Link to={`/post/${post.id}`} className="post-link" onClick={handleCardClick}>
				<h3 className="post-title">{post.title}</h3>
				<p className="post-excerpt">
					{post.content.length > 150
						? post.content.substring(0, 150) + '...'
						: post.content}
				</p>
				<div className="post-meta">
					<span className="author">By {post.author}</span>
					<span className="date">{new Date(post.created_at).toLocaleDateString()}</span>
				</div>
			</Link>
			<div className="post-actions">
				<button
					className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
					onClick={handleLike}
					title={isLiked ? 'Unlike' : 'Like'}
				>
					❤️ {likes}
				</button>
				<button className="action-btn share-btn" onClick={handleShare} title="Share">
					🔗 Share
				</button>
				<span className="view-count">👁️ {views}</span>
			</div>
		</div>
	);
};

export default PostCard;