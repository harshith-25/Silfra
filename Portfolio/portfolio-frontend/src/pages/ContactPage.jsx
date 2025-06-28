import React, { useState } from 'react';
import { submitContactMessage } from '../api/messages';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal'; // Use custom Modal

function ContactPage() {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setModalMessage('');

    if (!senderName.trim() || !senderEmail.trim() || !message.trim()) {
      setError("Please fill in all required fields (Name, Email, Message).");
      setLoading(false);
      return;
    }

    try {
      await submitContactMessage({ senderName, senderEmail, subject, message });
      setModalMessage("Your message has been sent successfully!");
      setIsModalOpen(true);
      // Clear form
      setSenderName('');
      setSenderEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setError(err.message || "Failed to send message. Please try again later.");
      setModalMessage('Failed to send message: ' + (err.message || 'Unknown error'));
      setIsModalOpen(true);
      console.error("Contact form submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <h2>Contact Me</h2>
      <p className="contact-intro">
        Have a question or want to discuss a project? Feel free to reach out!
      </p>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="senderName">Your Name:</label>
          <input type="text" id="senderName" value={senderName} onChange={(e) => setSenderName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="senderEmail">Your Email:</label>
          <input type="email" id="senderEmail" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="subject">Subject (Optional):</label>
          <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows="6" required></textarea>
        </div>
        <button type="submit" className="send-message-button" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Message Status">
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
}

export default ContactPage;