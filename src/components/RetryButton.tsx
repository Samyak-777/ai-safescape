
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface RetryButtonProps {
  onRetry: () => void;
  isRetrying: boolean;
  failedServices?: string[];
  className?: string;
}

const RetryButton: React.FC<RetryButtonProps> = ({
  onRetry,
  isRetrying,
  failedServices = [],
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        onClick={onRetry}
        disabled={isRetrying}
        variant="outline"
        size="sm"
        className="h-8"
      >
        <RefreshCw className={`h-3 w-3 mr-1 ${isRetrying ? 'animate-spin' : ''}`} />
        {isRetrying ? 'Retrying...' : 'Retry'}
      </Button>
      
      {failedServices.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <AlertCircle className="h-3 w-3" />
          <span>{failedServices.length} service{failedServices.length > 1 ? 's' : ''} failed</span>
        </div>
      )}
    </div>
  );
};

export default RetryButton;
