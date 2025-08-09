'use client';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Toaster } from "@/components/ui/toaster";
import { LayoutProvider } from './layout.client';
import { Suspense, Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ClientWrapperProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

// Loading component for Suspense boundaries
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex items-center gap-2 text-muted-foreground">
        <RefreshCw className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </div>
    </div>
  );
}

// Error boundary component
function ErrorFallback({ 
  error, 
  resetErrorBoundary 
}: { 
  error: Error; 
  resetErrorBoundary: () => void; 
}) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Alert className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="text-sm text-muted-foreground mb-4">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <Button onClick={resetErrorBoundary} variant="outline" size="sm">
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Custom Error Boundary class component
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }
      return <ErrorFallback error={this.state.error} resetErrorBoundary={this.resetError} />;
    }

    return this.props.children;
  }
}

// Header wrapper with error boundary
function HeaderWrapper() {
  return (
    <ErrorBoundary
      fallback={() => <div className="h-14 border-b bg-background" />}
      onError={(error: Error) => console.error('Header error:', error)}
    >
      <Suspense fallback={<div className="h-14 border-b bg-background animate-pulse" />}>
        <Header />
      </Suspense>
    </ErrorBoundary>
  );
}

// Footer wrapper with error boundary
function FooterWrapper() {
  return (
    <ErrorBoundary
      fallback={() => <div className="py-8 bg-secondary/30 mt-auto" />}
      onError={(error: Error) => console.error('Footer error:', error)}
    >
      <Suspense fallback={<div className="py-8 bg-secondary/30 mt-auto animate-pulse" />}>
        <Footer />
      </Suspense>
    </ErrorBoundary>
  );
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <ErrorBoundary
      onError={(error: Error, errorInfo: any) => {
        console.error('App error:', error, errorInfo);
        // You can add error reporting service here
        // e.g., Sentry.captureException(error);
      }}
    >
      <LayoutProvider>
        <div className="flex flex-col min-h-screen bg-background">
          <HeaderWrapper />
          
          <main className="flex-1 flex flex-col">
            <ErrorBoundary
              onError={(error: Error) => console.error('Main content error:', error)}
            >
              <Suspense fallback={<LoadingFallback />}>
                {children}
              </Suspense>
            </ErrorBoundary>
          </main>
          
          <FooterWrapper />
        </div>
        
        {/* Toast notifications */}
        <Toaster />
      </LayoutProvider>
    </ErrorBoundary>
  );
}
