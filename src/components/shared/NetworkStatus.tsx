import React, { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";

export const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [apiReachable, setApiReachable] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  const checkApiConnection = async () => {
    try {
      setIsChecking(true);
      // Try to fetch products without authentication as a simple health check
      await api.getProducts({ per_page: 1 });
      setApiReachable(true);
    } catch (error) {
      console.log("API health check failed:", error);
      setApiReachable(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkApiConnection();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setApiReachable(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial API check
    if (isOnline) {
      checkApiConnection();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Don't show anything if everything is working
  if (isOnline && apiReachable) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <WifiOff className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          {!isOnline
            ? "No internet connection detected"
            : "Unable to connect to the server"}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={checkApiConnection}
          disabled={isChecking || !isOnline}
          className="ml-2"
        >
          {isChecking ? (
            <RefreshCw className="h-3 w-3 animate-spin" />
          ) : (
            <Wifi className="h-3 w-3" />
          )}
          {isChecking ? "Checking..." : "Retry"}
        </Button>
      </AlertDescription>
    </Alert>
  );
};
