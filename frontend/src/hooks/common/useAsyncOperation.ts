import { useState } from 'react';
import { LoadingState } from '@/types/common.types';

/**
 * Hook genérico para manejar operaciones asíncronas
 * Evita duplicar loading, error handling, etc.
 */
export function useAsyncOperation<T = any>() {
  const [state, setState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  // const _execute = async (operation: () => Promise<T>): Promise<T> => {
    setState('loading');
    setError(null);
    
    try {
      const result = await operation();
      setData(result);
      setState('success');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setState('error');
      throw err;
    }
  };

  // const _reset = () => {
    setState('idle');
    setError(null);
    setData(null);
  };

  return {
    state,
    loading: state === 'loading',
    error,
    data,
    execute,
    reset,
  };
} 