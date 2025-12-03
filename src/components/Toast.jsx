import { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <XCircle className="text-red-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-accent p-4 flex items-center gap-3 min-w-[300px] animate-slide-in">
      {icons[type]}
      <p className="text-text-main flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;

