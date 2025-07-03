import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Debounce avanzado con cancelación
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
  }
): T & { cancel: () => void; flush: () => ReturnType<T> | undefined } {
  let timeoutId: NodeJS.Timeout | undefined;
  let maxTimeoutId: NodeJS.Timeout | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let lastArgs: Parameters<T> | undefined;
  let result: ReturnType<T> | undefined;

  const { leading = false, trailing = true, maxWait } = options || {};

  function invokeFunc(time: number) {
    const args = lastArgs!;
    lastArgs = undefined;
    lastInvokeTime = time;
    result = func.apply(null, args);
    return result;
  }

  function leadingEdge(time: number) {
    lastInvokeTime = time;
    timeoutId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number) {
    const timeSinceLastCall = time - lastCallTime!;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time: number) {
    const timeSinceLastCall = time - lastCallTime!;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timeoutId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time: number) {
    timeoutId = undefined;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = undefined;
    return result;
  }

  function cancel() {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    if (maxTimeoutId !== undefined) {
      clearTimeout(maxTimeoutId);
    }
    lastInvokeTime = 0;
    lastArgs = undefined;
    lastCallTime = undefined;
    timeoutId = undefined;
    maxTimeoutId = undefined;
  }

  function flush() {
    return timeoutId === undefined ? result : trailingEdge(Date.now());
  }

  const debounced = function (...args: Parameters<T>) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait !== undefined) {
        timeoutId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timeoutId === undefined) {
      timeoutId = setTimeout(timerExpired, wait);
    }
    return result;
  } as T & { cancel: () => void; flush: () => ReturnType<T> | undefined };

  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced;
}

/**
 * Throttle avanzado
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: { leading?: boolean; trailing?: boolean }
): T & { cancel: () => void; flush: () => ReturnType<T> | undefined } {
  const { leading = true, trailing = true } = options || {};
  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait,
  });
}

/**
 * Hook para debounce de valores
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook para lazy loading con Intersection Observer
 */
export function useLazyLoad(options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return { ref, isIntersecting, isLoaded };
}

/**
 * Memoización personalizada con cache LRU
 */
export class LRUCache<K, V> {
  private capacity: number;
  private cache = new Map<K, V>();

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    if (this.cache.has(key)) {
      // Mover al final (más reciente)
      const value = this.cache.get(key)!;
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return undefined;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      // Actualizar valor existente
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Eliminar el más antiguo
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Hook para memoización con cache LRU
 */
export function useLRUMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  capacity = 10
): T {
  const cacheRef = useRef(new LRUCache<string, T>(capacity));
  const key = JSON.stringify(deps);

  return useMemo(() => {
    const cached = cacheRef.current.get(key);
    if (cached !== undefined) {
      return cached;
    }

    const value = factory();
    cacheRef.current.set(key, value);
    return value;
  }, [key, factory]);
}

/**
 * Utilities para medición de performance
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private measurements = new Map<string, number>();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMeasure(name: string): void {
    this.measurements.set(name, performance.now());
  }

  endMeasure(name: string, log = true): number {
    const startTime = this.measurements.get(name);
    if (!startTime) {
      console.warn(`No se encontró medición para: ${name}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.measurements.delete(name);

    if (log) {
      console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  measureAsync<T>(name: string, asyncFn: () => Promise<T>): Promise<T> {
    this.startMeasure(name);
    return asyncFn().finally(() => {
      this.endMeasure(name);
    });
  }
}

/**
 * HOC para medir performance de componentes
 */
export function withPerformanceMonitor<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) {
  return function PerformanceMonitoredComponent(props: P) {
    const name = componentName || Component.displayName || Component.name;
    const monitor = PerformanceMonitor.getInstance();

    useEffect(() => {
      monitor.startMeasure(`${name}-render`);
      return () => {
        monitor.endMeasure(`${name}-render`);
      };
    });

    return React.createElement(Component, props);
  };
}

/**
 * Hook para detectar cambios de tamaño de ventana
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = throttle(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 100);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * Hook para detectar si el usuario está online
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
} 