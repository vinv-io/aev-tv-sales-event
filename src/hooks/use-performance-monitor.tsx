import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
}

export function usePerformanceMonitor(componentName: string) {
  const renderStartTime = useRef<number | undefined>(undefined);
  const mountTime = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Component mount time
    mountTime.current = performance.now();
    
    return () => {
      // Component unmount
      if (process.env.NODE_ENV === 'development') {
        const unmountTime = performance.now();
        const totalLifetime = unmountTime - (mountTime.current || 0);
        console.log(`${componentName} lifetime: ${totalLifetime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);

  useEffect(() => {
    // Render performance tracking
    if (process.env.NODE_ENV === 'development') {
      renderStartTime.current = performance.now();
    }
  });

  useEffect(() => {
    // After render
    if (process.env.NODE_ENV === 'development' && renderStartTime.current) {
      const renderEndTime = performance.now();
      const renderTime = renderEndTime - renderStartTime.current;
      
      if (renderTime > 16) { // Warn if render takes longer than 16ms (60fps)
        console.warn(`${componentName} slow render: ${renderTime.toFixed(2)}ms`);
      }
    }
  });

  return {
    startTiming: () => {
      if (process.env.NODE_ENV === 'development') {
        renderStartTime.current = performance.now();
      }
    },
    endTiming: (operation: string) => {
      if (process.env.NODE_ENV === 'development' && renderStartTime.current) {
        const endTime = performance.now();
        const duration = endTime - renderStartTime.current;
        console.log(`${componentName} ${operation}: ${duration.toFixed(2)}ms`);
      }
    },
  };
}
