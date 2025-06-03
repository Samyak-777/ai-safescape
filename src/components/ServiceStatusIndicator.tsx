
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckCircle, AlertTriangle, XCircle, Activity, Info } from 'lucide-react';
import { errorHandler } from '@/services/errorHandling';

const ServiceStatusIndicator: React.FC = () => {
  const [serviceHealth, setServiceHealth] = useState<Record<string, { healthy: boolean; lastError?: any }>>({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const updateHealth = () => {
      setServiceHealth(errorHandler.getServiceHealth());
    };

    updateHealth();
    const interval = setInterval(updateHealth, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getOverallStatus = () => {
    const services = Object.values(serviceHealth);
    const unhealthy = services.filter(s => !s.healthy).length;
    
    if (unhealthy === 0) return 'healthy';
    if (unhealthy <= 2) return 'degraded';
    return 'down';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
      case 'down':
        return <XCircle className="h-3 w-3 text-red-500" />;
      default:
        return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'down':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-7 px-2 ${getStatusColor(overallStatus)}`}
        >
          {getStatusIcon(overallStatus)}
          <span className="ml-1 text-xs capitalize">{overallStatus}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <h3 className="font-semibold">Service Status</h3>
          </div>
          
          <div className="space-y-2">
            {Object.entries(serviceHealth).map(([service, health]) => (
              <div key={service} className="flex items-center justify-between">
                <span className="text-sm">{service}</span>
                <div className="flex items-center gap-2">
                  {health.healthy ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Healthy
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      <XCircle className="h-3 w-3 mr-1" />
                      Issues
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {overallStatus !== 'healthy' && (
            <div className="pt-2 border-t">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  Some services may be experiencing issues. Analysis will continue using available services.
                </div>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ServiceStatusIndicator;
