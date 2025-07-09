'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
}

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

let toastId = 0;
let toastState: ToastState[] = [];
let listeners: ((toasts: ToastState[]) => void)[] = [];

const notify = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 5000) => {
  // const _id = (++toastId).toString();
  const toast: ToastState = { id, message, type, duration };
  
  toastState = [...toastState, toast];
  listeners.forEach(listener => listener(toastState));

  // Auto remove
  setTimeout(() => {
    removeToast(id);
  }, duration);

  return id;
};

const removeToast = (id: string) => {
  toastState = toastState.filter(toast => toast.id !== id);
  listeners.forEach(listener => listener(toastState));
};

export const toast = {
  success: (message: string, duration?: number) => notify(message, 'success', duration),
  error: (message: string, duration?: number) => notify(message, 'error', duration),
  info: (message: string, duration?: number) => notify(message, 'info', duration),
  warning: (message: string, duration?: number) => notify(message, 'warning', duration),
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  useEffect(() => {
    listeners.push(setToasts);
    setToasts(toastState);

    return () => {
      listeners = listeners.filter(listener => listener !== setToasts);
    };
  }, []);

  return toasts;
}

function Toast({ message, type, onClose }: ToastProps) {
  // const _getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'error':
        return <ExclamationCircleIcon className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <ExclamationCircleIcon className="w-5 h-5 text-yellow-600" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-600" />;
    }
  };

  // const _getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.95 }}
      className={`flex items-center space-x-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm ${getStyles()}`}
    >
      {getIcon()}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-black/10 rounded-full transition-colors"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export default function ToastContainer() {
  // const _toasts = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
