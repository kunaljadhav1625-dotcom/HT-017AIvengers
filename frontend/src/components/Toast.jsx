import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
    const styles = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800'
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <XCircle className="w-5 h-5" />,
        warning: <AlertCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />
    };

    return (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border-2 shadow-lg animate-in slide-in-from-top-4 ${styles[type]}`}>
            {icons[type]}
            <span className="font-medium">{message}</span>
            {onClose && (
                <button onClick={onClose} className="ml-2 hover:opacity-70">
                    <XCircle className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

export default Toast;
