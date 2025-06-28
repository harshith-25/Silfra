import React from 'react';

function Footer() {
  return (
    <footer className="site-footer">
      <p>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
      <div className="social-links">
        {/* Replace with your actual social media links */}
        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">GitHub</a>
        <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">LinkedIn</a>
        {/* Add more social links as needed */}
      </div>
    </footer>
  );
}

export default Footer;