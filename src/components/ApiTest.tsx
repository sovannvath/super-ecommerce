import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

export const ApiTest: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDirectFetch = async () => {
    setLoading(true);
    try {
      console.log("Testing direct fetch...");
      const response = await fetch(
        "https://laravel-wtc.onrender.com/api/products",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          mode: "cors",
        },
      );

      console.log("Direct fetch response:", response);
      const data = await response.json();
      console.log("Direct fetch data:", data);
      setResult({ type: "direct", success: true, data });
    } catch (error) {
      console.error("Direct fetch error:", error);
      setResult({ type: "direct", success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testApiClient = async () => {
    setLoading(true);
    try {
      console.log("Testing API client...");
      const response = await api.getProducts();
      console.log("API client response:", response);
      setResult({ type: "api-client", success: true, data: response });
    } catch (error) {
      console.error("API client error:", error);
      setResult({ type: "api-client", success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="m-4 max-w-2xl">
      <CardHeader>
        <CardTitle>API Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button onClick={testDirectFetch} disabled={loading}>
            Test Direct Fetch
          </Button>
          <Button onClick={testApiClient} disabled={loading}>
            Test API Client
          </Button>
        </div>

        {loading && <p>Testing...</p>}

        {result && (
          <div className="mt-4 p-4 border rounded-lg">
            <h3 className="font-bold mb-2">
              {result.type} - {result.success ? "✅ Success" : "❌ Failed"}
            </h3>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-60">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
