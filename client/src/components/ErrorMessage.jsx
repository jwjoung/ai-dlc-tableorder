import { useEffect, useState } from 'react';

function ErrorMessage({ message, onClose, autoHide = true, duration = 3000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!autoHide) return;

    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [autoHide, duration, onClose]);

  if (!visible || !message) return null;

  return (
    <div
      className="bg-red-600 text-white px-4 py-3 rounded-lg flex items-center justify-between shadow-md"
      data-testid="error-message"
    >
      <span className="text-sm">{message}</span>
      {onClose && (
        <button
          onClick={() => {
            setVisible(false);
            onClose();
          }}
          className="ml-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
          data-testid="error-close-button"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
