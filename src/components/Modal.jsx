// Modal.jsx
import React from 'react';
import './Modal.scss';

const Modal = ({ isOpen, onClose, hlsAddr }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <iframe
          src={hlsAddr}
          style={{ width: '100%', height: '100%' }}
          title="CCTV Feed"
        ></iframe>
      </div>
    </div>
  );
};

export default Modal;
