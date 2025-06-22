import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  color: string;
  alert?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color,
  alert,
}) => {
  return (
    <Card
      className={`relative overflow-hidden ${alert ? "border-yellow-300 shadow-yellow-100" : ""}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-metallic-accent text-sm font-medium">{title}</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-metallic-primary">
                {value}
              </h3>
              {alert && (
                <Badge className="bg-yellow-100 text-yellow-800 animate-pulse">
                  Alert
                </Badge>
              )}
            </div>
            {trend && <p className="text-xs text-metallic-accent">{trend}</p>}
          </div>
          <div
            className={`p-3 rounded-lg bg-gradient-to-r ${color} text-white`}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {alert && (
          <div className="absolute inset-0 bg-yellow-50/20 pointer-events-none" />
        )}
      </CardContent>
    </Card>
  );
};
