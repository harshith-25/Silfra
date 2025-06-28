import React, { useState, useEffect } from 'react';

function SkillForm({ initialData = {}, onSubmit, onClose, isEditMode = false }) {
  const [formData, setFormData] = useState({
    name: '',
    proficiency: 'Beginner'
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data only when initialData.id changes to avoid resetting during typing
  useEffect(() => {
    setFormData({
      name: initialData?.name || '',
      proficiency: initialData?.proficiency || 'Beginner'
    });
  }, [initialData?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing/selecting
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    console.log('Skill form data being submitted:', formData); // Debug log

    // Validation
    if (!formData.name || !formData.name.trim()) {
      setError('Skill name is required!');
      setIsLoading(false);
      return;
    }

    if (!formData.proficiency) {
      setError('Proficiency level is required!');
      setIsLoading(false);
      return;
    }

    // Prepare clean data for submission
    const skillData = {
      name: formData.name.trim(),
      proficiency: formData.proficiency
    };

    console.log('Clean skill data:', skillData); // Debug log

    try {
      const result = await onSubmit(skillData);
      console.log('Skill submission result:', result); // Debug log

      // Reset form after successful submission (only for create mode)
      if (!isEditMode) {
        setFormData({
          name: '',
          proficiency: 'Beginner'
        });
      }
    } catch (err) {
      console.error('Skill form submission error:', err); // Debug log
      setError(err.message || 'Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="skill-form-container">
      <h3>{isEditMode ? 'Edit Skill' : 'Add New Skill'}</h3>
      <form onSubmit={handleSubmit} className="skill-form">
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="name">Skill Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter skill name (e.g., JavaScript, React)"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="proficiency">Proficiency Level *</label>
          <select
            id="proficiency"
            name="proficiency"
            value={formData.proficiency}
            onChange={handleChange}
            required
            disabled={isLoading}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="button primary-button"
            disabled={isLoading}
          >
            {isLoading
              ? (isEditMode ? 'Updating...' : 'Adding...')
              : (isEditMode ? 'Update Skill' : 'Add Skill')
            }
          </button>
          <button
            type="button"
            onClick={onClose}
            className="button secondary-button"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default SkillForm;