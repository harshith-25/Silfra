import React, { useState, useEffect } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../api/projects';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import ProjectForm from './ProjectForm'; // Reusable form
import Modal from '../components/Modal';

function ManageProjects() {
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingProject, setEditingProject] = useState(null); // Project object for editing
	const [modalMessage, setModalMessage] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);

	const fetchProjects = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getProjects();
			setProjects(data);
		} catch (err) {
			setError(err.message || "Failed to load projects.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProjects();
	}, []);

	const handleAddProject = () => {
		setEditingProject(null); // Clear any editing state
		setIsFormOpen(true);
	};

	const handleEditProject = (project) => {
		setEditingProject(project); // Set project for editing
		setIsFormOpen(true);
	};

	const handleDeleteProject = async (id) => {
		if (window.confirm('Are you sure you want to delete this project?')) {
			setError(null);
			try {
				await deleteProject(id);
				setProjects(projects.filter(p => p.id !== id));
				setModalMessage('Project deleted successfully!');
				setIsModalOpen(true);
			} catch (err) {
				setError(err.message || "Failed to delete project.");
				setModalMessage('Failed to delete project: ' + (err.message || 'Unknown error'));
				setIsModalOpen(true);
			}
		}
	};

	const handleSubmitForm = async (projectData) => {
		setError(null);
		try {
			if (editingProject) {
				// Update existing project
				const updated = await updateProject(editingProject.id, projectData);
				setProjects(projects.map(p => (p.id === updated.id ? updated : p)));
				setModalMessage('Project updated successfully!');
			} else {
				// Create new project
				const newProject = await createProject(projectData);
				setProjects([newProject, ...projects]); // Add to top
				setModalMessage('Project created successfully!');
			}
			setIsFormOpen(false); // Close form
			setEditingProject(null); // Reset editing state
			setIsModalOpen(true);
		} catch (err) {
			setError(err.message || "Failed to save project.");
			setModalMessage('Failed to save project: ' + (err.message || 'Unknown error'));
			setIsModalOpen(true);
		}
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="admin-section">
			<div className="page-header">
				<h2>Manage Projects</h2>
				<button onClick={handleAddProject} className="add-button">Add New Project</button>
			</div>

			{error && <ErrorMessage message={error} />}

			{isFormOpen && (
				<div className="form-container">
					<h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
					<ProjectForm
						onSubmit={handleSubmitForm}
						initialData={editingProject}
						isEditMode={!!editingProject}
					/>
					<button onClick={() => { setIsFormOpen(false); setEditingProject(null); }} className="cancel-button form-cancel">
						Cancel Form
					</button>
				</div>
			)}

			{projects.length === 0 && !loading && !error ? (
				<p className="no-data-message">No projects added yet.</p>
			) : (
				<div className="admin-table-container">
					<table className="admin-table">
						<thead>
							<tr>
								<th>Title</th>
								<th>Technologies</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{projects.map((project) => (
								<tr key={project.id}>
									<td>{project.title}</td>
									<td>{project.technologies}</td>
									<td className="admin-actions-cell">
										<button onClick={() => handleEditProject(project)} className="edit-button">Edit</button>
										<button onClick={() => handleDeleteProject(project.id)} className="delete-button">Delete</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Notification">
				<p>{modalMessage}</p>
			</Modal>
		</div>
	);
}

export default ManageProjects;