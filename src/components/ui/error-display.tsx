import { memo } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { Button } from './button';

interface ErrorDisplayProps {
  error: Error | string;
  title?: string;
  onRetry?: () => void;
  retryLabel?: string;
  variant?: 'destructive' | 'warning' | 'default';
  className?: string;
}

const VARIANTS = {
  destructive: {
    icon: AlertCircle,
    className: 'border-destructive/50 text-destructive dark:border-destructive',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-yellow-500/50 text-yellow-600 dark:border-yellow-500',
  },
  default: {
    icon: Info,
    className: '',
  },
} as const;

export const ErrorDisplay = memo(({
  error,
  title = 'Error',
  onRetry,
  retryLabel = 'Try again',
  variant = 'destructive',
  className = '',
}: ErrorDisplayProps) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const { icon: Icon, className: variantClassName } = VARIANTS[variant];

  return (
    <Alert className={`${variantClassName} ${className}`}>
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p className="text-sm mb-3">{errorMessage}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="h-8"
          >
            {retryLabel}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
});

ErrorDisplay.displayName = 'ErrorDisplay';
