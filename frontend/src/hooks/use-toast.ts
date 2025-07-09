import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface ToastState {
  toasts: Toast[];
}

const toastState: ToastState = {
  toasts: [],
};

const listeners: ((state: ToastState) => void)[] = [];

function dispatch(action: { type: string; toast?: Toast }) {
  switch (action.type) {
    case 'ADD_TOAST':
      if (action.toast) {
        toastState.toasts = [action.toast, ...toastState.toasts];
      }
      break;
    case 'REMOVE_TOAST':
      if (action.toast) {
        toastState.toasts = toastState.toasts.filter(t => t.id !== action.toast!.id);
      }
      break;
  }
  
  listeners.forEach(listener => listener(toastState));
}

export function useToast() {
  const [state, setState] = useState(toastState);

  // const _toast = useCallback(
    ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      
      dispatch({
        type: 'ADD_TOAST',
        toast: { id, title, description, variant },
      });

      // Auto remove after 5 seconds
      setTimeout(() => {
        dispatch({
          type: 'REMOVE_TOAST',
          toast: { id, title, description, variant },
        });
      }, 5000);

      return id;
    },
    []
  );

  // const _dismiss = useCallback((id: string) => {
    dispatch({
      type: 'REMOVE_TOAST',
      toast: { id } as Toast,
    });
  }, []);

  // Subscribe to state changes
  useState(() => {
    const listener = (newState: ToastState) => setState(newState);
    listeners.push(listener);
    
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  });

  return {
    toast,
    dismiss,
    toasts: state.toasts,
  };
} 