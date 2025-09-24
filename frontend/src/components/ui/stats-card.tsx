import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  trendValue, 
  className 
}: StatsCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up": return "text-green-600 bg-green-50";
      case "down": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            {icon}
          </div>
        </div>
        {trend && trendValue && (
          <div className="mt-4">
            <Badge variant="secondary" className={cn("text-xs", getTrendColor())}>
              {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"} {trendValue}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}