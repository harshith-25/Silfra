import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost, deletePost } from '../api';

const PostDetailPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [likes, setLikes] = useState(0);
	const [isLiked, setIsLiked] = useState(false);
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState('');
	const [commentAuthor, setCommentAuthor] = useState('');
	const [views, setViews] = useState(0);

	useEffect(() => {
		fetchPost();
		loadComments();
		loadLikeStatus();
		incrementViews();
	}, [id]);

	const fetchPost = async () => {
		try {
			const data = await getPost(id);
			setPost(data);
		} catch (err) {
			setError('Failed to load post');
		} finally {
			setLoading(false);
		}
	};

	const loadLikeStatus = () => {
		const savedLikes = JSON.parse(localStorage.getItem('postLikes') || '{}');
		const savedLikedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');

		setLikes(savedLikes[id] || 0);
		setIsLiked(savedLikedPosts.includes(parseInt(id)));
	};

	const loadComments = () => {
		const savedComments = JSON.parse(localStorage.getItem('postComments') || '{}');
		setComments(savedComments[id] || []);
	};

	const incrementViews = () => {
		const savedViews = JSON.parse(localStorage.getItem('postViews') || '{}');
		savedViews[id] = (savedViews[id] || 0) + 1;
		localStorage.setItem('postViews', JSON.stringify(savedViews));
		setViews(savedViews[id]);
	};

	const handleLike = () => {
		const savedLikes = JSON.parse(localStorage.getItem('postLikes') || '{}');
		const savedLikedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');

		if (isLiked) {
			savedLikes[id] = Math.max(0, (savedLikes[id] || 0) - 1);
			const index = savedLikedPosts.indexOf(parseInt(id));
			if (index > -1) savedLikedPosts.splice(index, 1);
		} else {
			savedLikes[id] = (savedLikes[id] || 0) + 1;
			savedLikedPosts.push(parseInt(id));
		}

		localStorage.setItem('postLikes', JSON.stringify(savedLikes));
		localStorage.setItem('likedPosts', JSON.stringify(savedLikedPosts));

		setLikes(savedLikes[id]);
		setIsLiked(!isLiked);
	};

	const handleShare = () => {
		const url = window.location.href;

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

	const handleAddComment = (e) => {
		e.preventDefault();
		if (!newComment.trim()) return;

		const comment = {
			id: Date.now(),
			text: newComment.trim(),
			author: commentAuthor.trim() || 'Anonymous',
			timestamp: new Date().toISOString()
		};

		const savedComments = JSON.parse(localStorage.getItem('postComments') || '{}');
		if (!savedComments[id]) savedComments[id] = [];
		savedComments[id].unshift(comment);
		localStorage.setItem('postComments', JSON.stringify(savedComments));

		setComments(savedComments[id]);
		setNewComment('');
		setCommentAuthor('');
	};

	const handleDeletePost = async () => {
		if (window.confirm('Are you sure you want to delete this post?')) {
			try {
				await deletePost(id);
				navigate('/');
			} catch (err) {
				alert('Failed to delete post');
			}
		}
	};

	if (loading) return <div className="loading">Loading post...</div>;
	if (error) return <div className="error">{error}</div>;
	if (!post) return <div className="error">Post not found</div>;

	return (
		<div className="container">
			<div className="post-detail">
				<div className="post-header">
					<h1 className="post-title">{post.title}</h1>
					<div className="post-meta">
						<span className="author">By {post.author}</span>
						<span className="date">{new Date(post.created_at).toLocaleDateString()}</span>
						<span className="view-count">👁️ {views} views</span>
					</div>
				</div>

				<div className="post-content">
					<p>{post.content}</p>
				</div>

				<div className="post-actions">
					<button
						className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
						onClick={handleLike}
					>
						❤️ {likes} {likes === 1 ? 'Like' : 'Likes'}
					</button>
					<button className="action-btn share-btn" onClick={handleShare}>
						🔗 Share
					</button>
					<Link to={`/edit/${post.id}`} className="action-btn edit-btn">
						✏️ Edit
					</Link>
					<button className="action-btn delete-btn" onClick={handleDeletePost}>
						🗑️ Delete
					</button>
				</div>

				<div className="comments-section">
					<h3>Comments ({comments.length})</h3>

					<form onSubmit={handleAddComment} className="comment-form">
						<input
							type="text"
							placeholder="Your name (optional)"
							value={commentAuthor}
							onChange={(e) => setCommentAuthor(e.target.value)}
							className="comment-author-input"
						/>
						<textarea
							placeholder="Add a comment..."
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							className="comment-textarea"
							rows="3"
							required
						/>
						<button type="submit" className="btn btn-primary">
							Add Comment
						</button>
					</form>

					<div className="comments-list">
						{comments.map(comment => (
							<div key={comment.id} className="comment">
								<div className="comment-header">
									<strong className="comment-author">{comment.author}</strong>
									<span className="comment-date">
										{new Date(comment.timestamp).toLocaleDateString()}
									</span>
								</div>
								<p className="comment-text">{comment.text}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostDetailPage;