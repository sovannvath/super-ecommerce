import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { WifiOff, Database, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OfflineBannerProps {
  isOffline: boolean;
  onRetry?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOffline,
  onRetry,
}) => {
  if (!isOffline) return null;

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50">
      <WifiOff className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-orange-800">
            <strong>Offline Mode:</strong> Showing sample data. Some features
            may be limited.
          </span>
          <Badge
            variant="outline"
            className="text-orange-700 border-orange-400"
          >
            <Database className="h-3 w-3 mr-1" />
            Demo Data
          </Badge>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="border-orange-400 text-orange-700 hover:bg-orange-100"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry Connection
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
