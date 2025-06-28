import React, { useState, useEffect } from 'react';
import { getProjects } from '../api/projects';
import { getSkills } from '../api/skills';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

function HomePage() {
	const [projects, setProjects] = useState([]);
	const [skills, setSkills] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadData = async () => {
			try {
				const fetchedProjects = await getProjects();
				setProjects(fetchedProjects);

				const fetchedSkills = await getSkills();
				setSkills(fetchedSkills);

				setLoading(false);
			} catch (err) {
				setError("Failed to load portfolio data. Please try again.");
				console.error("Homepage data load error:", err);
				setLoading(false);
			}
		};
		loadData();
	}, []);

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="home-page-content">
			<section id="about" className="about-section">
				<div className="about-content">
					<div className="profile-image-container">
						<img src="https://placehold.co/150x150/lightblue/white?text=Your+Photo" alt="Your Profile" className="profile-image" />
					</div>
					<h2>About Me</h2>
					<p>
						Hello! I'm Harshith, a passionate Full Stack Developer with a keen interest in building scalable and user-friendly web applications. I specialize in React, Node.js, MongoDB, and Express, and love bringing ideas to life through clean, efficient code.
					</p>
					<p>
						My journey in software development began with a curiosity for how things work and a love for problem-solving. Since then, I've worked on real-world projects during my internship at QuadB Technologies, constantly exploring new tools and frameworks to sharpen my skills.
					</p>
					<p>
						When I'm not coding, you can find me watching movies, thinking up stories, or playing badminton. I believe in continuous learning and applying thoughtful, creative solutions to real-world challenges. Feel free to explore my projects and connect with me!
					</p>
				</div>
			</section>

			<section id="projects" className="projects-section">
				<h2>My Projects</h2>
				{error && <ErrorMessage message={error} />}
				{projects.length === 0 ? (
					<p className="no-data-message">No projects available yet. Check back soon!</p>
				) : (
					<div className="projects-grid">
						{projects.map((project) => (
							<div key={project.id} className="project-card">
								<img src={project.imageUrl || "https://placehold.co/400x250/cccccc/333333?text=Project+Image"} alt={project.title} className="project-image" onError={(e) => e.target.src = "https://placehold.co/400x250/cccccc/333333?text=Project+Image"} />
								<h3>{project.title}</h3>
								<p className="project-description">{project.description}</p>
								<p className="project-tech">Technologies: {project.technologies}</p>
								<div className="project-links">
									{project.liveLink && <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="project-link-button">Live Demo</a>}
									{project.githubLink && <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="project-link-button github-button">GitHub</a>}
								</div>
							</div>
						))}
					</div>
				)}
			</section>

			<section id="skills" className="skills-section">
				<h2>My Skills</h2>
				{error && <ErrorMessage message={error} />}
				{skills.length === 0 ? (
					<p className="no-data-message">No skills added yet.</p>
				) : (
					<ul className="skills-list">
						{skills.map((skill) => (
							<li key={skill.id} className="skill-item">
								<span className="skill-name">{skill.name}</span>
								<span className="skill-proficiency">{skill.proficiency}</span>
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}

export default HomePage;