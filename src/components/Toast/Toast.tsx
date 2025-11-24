import React, { useEffect } from 'react';
import { FaCheck, FaHeart, FaMusic, FaTimes } from 'react-icons/fa';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'info' | 'error';

interface ToastProps {
  message: string;
  type?: ToastType;
  icon?: 'check' | 'heart' | 'music' | 'error';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  icon,
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (icon) {
      case 'check':
        return <FaCheck />;
      case 'heart':
        return <FaHeart />;
      case 'music':
        return <FaMusic />;
      case 'error':
        return <FaTimes />;
      default:
        return <FaCheck />;
    }
  };

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <span className={styles.icon}>{getIcon()}</span>
      <span className={styles.message}>{message}</span>
      <button className={styles.closeBtn} onClick={onClose}>
        <FaTimes />
      </button>
    </div>
  );
};

export default Toast;
