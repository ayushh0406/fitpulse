import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { TrendingUp, TrendingDown, Target, Calendar } from "lucide-react";
import { useAuthStore } from "../lib/auth";

interface QuickStatsProps {
  className?: string;
}

export function QuickStats({ className }: QuickStatsProps) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return null;

  const stats = [
    {
      title: "Weekly Progress",
      value: "5/7",
      target: 7,
      current: 5,
      icon: Target,
      trend: "up",
      trendValue: "+2 from last week",
      color: "text-green-600"
    },
    {
      title: "Calories Burned",
      value: "2,400",
      target: 3000,
      current: 2400,
      icon: TrendingUp,
      trend: "up",
      trendValue: "+300 today",
      color: "text-blue-600"
    },
    {
      title: "Streak Days",
      value: "12",
      target: 30,
      current: 12,
      icon: Calendar,
      trend: "up",
      trendValue: "Personal best!",
      color: "text-purple-600"
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const progress = (stat.current / stat.target) * 100;
        
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 mt-2">
                <Progress value={progress} className="flex-1" />
                <Badge variant="secondary" className="text-xs">
                  {Math.round(progress)}%
                </Badge>
              </div>
              <div className="flex items-center space-x-1 mt-2">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className="text-xs text-muted-foreground">
                  {stat.trendValue}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}