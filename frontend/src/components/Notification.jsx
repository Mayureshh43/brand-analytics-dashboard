import { useEffect } from 'react';

const Notification = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getStyles = () => {
    const baseStyle = {
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '1rem',
      border: '1px solid',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    };

    const types = {
      success: {
        backgroundColor: '#f0fdf4',
        borderColor: '#bbf7d0',
        color: '#166534'
      },
      error: {
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca',
        color: '#dc2626'
      },
      warning: {
        backgroundColor: '#fffbeb',
        borderColor: '#fed7aa',
        color: '#ea580c'
      },
      info: {
        backgroundColor: '#eff6ff',
        borderColor: '#bfdbfe',
        color: '#1e40af'
      }
    };

    return { ...baseStyle, ...types[type] };
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '💡';
    }
  };

  return (
    <div style={getStyles()} role="alert" aria-live="polite">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{getIcon()}</span>
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: 'inherit',
            padding: '0',
            marginLeft: '1rem'
          }}
          aria-label="Close notification"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Notification;