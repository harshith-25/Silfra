import React from 'react';
import ReactDOM from 'react-dom';

function Modal({ children, isOpen, onClose, title = "Alert" }) {
	if (!isOpen) return null;

	return ReactDOM.createPortal(
		<div className="modal-overlay">
			<div className="modal-content">
				<div className="modal-header">
					<h3>{title}</h3>
					<button className="modal-close-button" onClick={onClose}>&times;</button>
				</div>
				<div className="modal-body">
					{children}
				</div>
				<div className="modal-footer">
					<button className="modal-ok-button" onClick={onClose}>OK</button>
				</div>
			</div>
		</div>,
		document.body // Portal to body to ensure it's on top
	);
}

export default Modal;