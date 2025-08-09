import { memo } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const SIZES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
} as const;

export const LoadingSpinner = memo(({ 
  size = 'md', 
  className = '', 
  text 
}: LoadingSpinnerProps) => {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`animate-spin ${SIZES[size]}`} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';
