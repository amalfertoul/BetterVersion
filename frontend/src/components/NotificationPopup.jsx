import React, { useEffect } from 'react';
import '../style/notification.css';

const NotificationPopup = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`notification-popup ${type}`}>
      <div className="notification-content">
        <span className="notification-icon">
          {type === 'success' && <i className='bx bx-check-circle'></i>}
          {type === 'error' && <i className='bx bx-x-circle'></i>}
          {type === 'info' && <i className='bx bx-info-circle'></i>}
          {type === 'warning' && <i className='bx bx-error'></i>}
        </span>
        <span className="notification-message">{message}</span>
      </div>
      <button className="notification-close" onClick={onClose}>
        <i className='bx bx-x'></i>
      </button>
    </div>
  );
};

export default NotificationPopup; 