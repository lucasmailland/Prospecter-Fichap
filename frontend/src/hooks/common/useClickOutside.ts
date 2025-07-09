import { useEffect, useRef } from 'react';

/**
 * Hook para detectar clicks fuera de un elemento
 * Evita duplicar esta lógica en cada componente
 */
export function useClickOutside<T extends HTMLElement>(
  handler: () => void,
  enabled: boolean = true
) {
  // const _ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handler, enabled]);

  return ref;
} 