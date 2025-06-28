import React, { useState, useEffect } from 'react';
import { createProject, updateProject } from '../api/projects';

function ProjectForm({ onSubmit, initialData = {}, isEditMode = false }) {
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		technologies: '',
		imageUrl: '',
		liveLink: '',
		githubLink: ''
	});
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	// Initialize form data only once when component mounts or when initialData.id changes
	useEffect(() => {
		setFormData({
			title: initialData?.title || '',
			description: initialData?.description || '',
			technologies: initialData?.technologies || '',
			imageUrl: initialData?.imageUrl || '',
			liveLink: initialData?.liveLink || '',
			githubLink: initialData?.githubLink || ''
		});
	}, [initialData?.id]); // Only depend on ID to avoid resetting during typing

	const handleInputChange = (field, value) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));
		// Clear error when user starts typing
		if (error) setError(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		console.log('Form data being submitted:', formData); // Debug log

		// Validation
		if (!formData.title || !formData.title.trim()) {
			setError('Project title is required!');
			setIsLoading(false);
			return;
		}

		if (!formData.description || !formData.description.trim()) {
			setError('Project description is required!');
			setIsLoading(false);
			return;
		}

		// Prepare clean data for submission
		const projectData = {
			title: formData.title.trim(),
			description: formData.description.trim(),
			technologies: formData.technologies.trim(),
			imageUrl: formData.imageUrl.trim(),
			liveLink: formData.liveLink.trim(),
			githubLink: formData.githubLink.trim()
		};

		console.log('Clean project data:', projectData); // Debug log

		try {
			let result;
			if (isEditMode && initialData?.id) {
				result = await updateProject(initialData.id, projectData);
			} else {
				result = await createProject(projectData);
			}

			console.log('API response:', result); // Debug log

			// Reset form after successful submission (only for create mode)
			if (!isEditMode) {
				setFormData({
					title: '',
					description: '',
					technologies: '',
					imageUrl: '',
					liveLink: '',
					githubLink: ''
				});
			}

			if (onSubmit) onSubmit(result);
		} catch (err) {
			console.error('Form submission error:', err); // Debug log
			setError(err.message || 'Something went wrong!');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="project-form-container">
			<form onSubmit={handleSubmit} className="admin-form">
				{error && <div className="form-error">{error}</div>}

				<div className="form-group">
					<label htmlFor="projectTitle">Title *</label>
					<input
						type="text"
						id="projectTitle"
						value={formData.title}
						onChange={(e) => handleInputChange('title', e.target.value)}
						placeholder="Enter project title"
						required
						disabled={isLoading}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="projectDescription">Description *</label>
					<textarea
						id="projectDescription"
						value={formData.description}
						onChange={(e) => handleInputChange('description', e.target.value)}
						placeholder="Enter project description"
						rows="5"
						required
						disabled={isLoading}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="projectTech">Technologies</label>
					<input
						type="text"
						id="projectTech"
						value={formData.technologies}
						onChange={(e) => handleInputChange('technologies', e.target.value)}
						placeholder="e.g., React, Node.js, MongoDB"
						disabled={isLoading}
					/>
					<small className="form-hint">Separate multiple technologies with commas</small>
				</div>

				<div className="form-group">
					<label htmlFor="projectImage">Image URL</label>
					<input
						type="url"
						id="projectImage"
						value={formData.imageUrl}
						onChange={(e) => handleInputChange('imageUrl', e.target.value)}
						placeholder="https://example.com/project-image.jpg"
						disabled={isLoading}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="projectLiveLink">Live Demo Link</label>
					<input
						type="url"
						id="projectLiveLink"
						value={formData.liveLink}
						onChange={(e) => handleInputChange('liveLink', e.target.value)}
						placeholder="https://your-project-demo.com"
						disabled={isLoading}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="projectGithubLink">GitHub Link</label>
					<input
						type="url"
						id="projectGithubLink"
						value={formData.githubLink}
						onChange={(e) => handleInputChange('githubLink', e.target.value)}
						placeholder="https://github.com/username/project-name"
						disabled={isLoading}
					/>
				</div>

				<div className="form-actions">
					<button
						type="submit"
						className="save-button"
						disabled={isLoading}
					>
						{isLoading
							? (isEditMode ? 'Updating...' : 'Adding...')
							: (isEditMode ? 'Update Project' : 'Add Project')
						}
					</button>
				</div>
			</form>
		</div>
	);
}

export default ProjectForm;