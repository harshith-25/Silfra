import React, { useState, useEffect } from 'react';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../api/skills';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import SkillForm from './SkillForm'; // Reusable form
import Modal from '../components/Modal';

function ManageSkills() {
	const [skills, setSkills] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingSkill, setEditingSkill] = useState(null);
	const [modalMessage, setModalMessage] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);

	const fetchSkills = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getSkills();
			setSkills(data);
		} catch (err) {
			setError(err.message || "Failed to load skills.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSkills();
	}, []);

	const handleAddSkill = () => {
		setEditingSkill(null);
		setIsFormOpen(true);
	};

	const handleEditSkill = (skill) => {
		setEditingSkill(skill);
		setIsFormOpen(true);
	};

	const handleDeleteSkill = async (id) => {
		if (window.confirm('Are you sure you want to delete this skill?')) {
			setError(null);
			try {
				await deleteSkill(id);
				setSkills(skills.filter(s => s.id !== id));
				setModalMessage('Skill deleted successfully!');
				setIsModalOpen(true);
			} catch (err) {
				setError(err.message || "Failed to delete skill.");
				setModalMessage('Failed to delete skill: ' + (err.message || 'Unknown error'));
				setIsModalOpen(true);
			}
		}
	};

	const handleSubmitForm = async (skillData) => {
		setError(null);
		try {
			if (editingSkill) {
				const updated = await updateSkill(editingSkill.id, skillData);
				setSkills(skills.map(s => (s.id === updated.id ? updated : s)));
				setModalMessage('Skill updated successfully!');
			} else {
				const newSkill = await createSkill(skillData);
				setSkills([...skills, newSkill]); // Add to end for skills
				setModalMessage('Skill created successfully!');
			}
			setIsFormOpen(false);
			setEditingSkill(null);
			setIsModalOpen(true);
		} catch (err) {
			setError(err.message || "Failed to save skill.");
			setModalMessage('Failed to save skill: ' + (err.message || 'Unknown error'));
			setIsModalOpen(true);
		}
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="admin-section">
			<div className="page-header">
				<h2>Manage Skills</h2>
				<button onClick={handleAddSkill} className="add-button">Add New Skill</button>
			</div>

			{error && <ErrorMessage message={error} />}

			{isFormOpen && (
				<div className="form-container">
					<h3>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h3>
					<SkillForm
						onSubmit={handleSubmitForm}
						initialData={editingSkill}
						isEditMode={!!editingSkill}
					/>
					<button onClick={() => { setIsFormOpen(false); setEditingSkill(null); }} className="cancel-button form-cancel">
						Cancel Form
					</button>
				</div>
			)}

			{skills.length === 0 && !loading && !error ? (
				<p className="no-data-message">No skills added yet.</p>
			) : (
				<div className="admin-table-container">
					<table className="admin-table">
						<thead>
							<tr>
								<th>Skill Name</th>
								<th>Proficiency</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{skills.map((skill) => (
								<tr key={skill.id}>
									<td>{skill.name}</td>
									<td>{skill.proficiency}</td>
									<td className="admin-actions-cell">
										<button onClick={() => handleEditSkill(skill)} className="edit-button">Edit</button>
										<button onClick={() => handleDeleteSkill(skill.id)} className="delete-button">Delete</button>
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

export default ManageSkills;