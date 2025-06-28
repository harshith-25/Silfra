import React, { useState, useEffect } from 'react';
import { getMessages, deleteMessage } from '../api/messages';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';

function ViewMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      setError(err.message || "Failed to load messages. You might need to log in as admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setError(null);
      try {
        await deleteMessage(id);
        setMessages(messages.filter(m => m.id !== id));
        setModalMessage('Message deleted successfully!');
        setIsModalOpen(true);
      } catch (err) {
        setError(err.message || "Failed to delete message.");
        setModalMessage('Failed to delete message: ' + (err.message || 'Unknown error'));
        setIsModalOpen(true);
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="admin-section">
      <div className="page-header">
        <h2>Messages</h2>
      </div>

      {error && <ErrorMessage message={error} />}

      {messages.length === 0 && !loading && !error ? (
        <p className="no-data-message">No messages received yet.</p>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table messages-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Sent At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id}>
                  <td>{message.sendername}</td>
                  <td>{message.senderemail}</td>
                  <td>{message.subject || 'N/A'}</td>
                  <td className="message-content-cell">{message.message}</td>
                  <td>{new Date(message.sent_at).toLocaleString()}</td>
                  <td className="admin-actions-cell">
                    <button onClick={() => handleDeleteMessage(message.id)} className="delete-button">Delete</button>
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

export default ViewMessages;