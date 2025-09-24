import { cn } from "@/lib/utils";

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked?: boolean;
  date?: string;
  className?: string;
}

export function AchievementBadge({ 
  title, 
  description, 
  icon, 
  unlocked = false, 
  date,
  className 
}: AchievementBadgeProps) {
  return (
    <div className={cn(
      "flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200",
      unlocked 
        ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-md" 
        : "bg-gray-50 border-gray-200 opacity-60",
      className
    )}>
      <div className={cn(
        "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
        unlocked 
          ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white" 
          : "bg-gray-300 text-gray-500"
      )}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "text-sm font-semibold",
          unlocked ? "text-gray-900" : "text-gray-500"
        )}>
          {title}
        </h3>
        <p className={cn(
          "text-xs",
          unlocked ? "text-gray-600" : "text-gray-400"
        )}>
          {description}
        </p>
        {unlocked && date && (
          <p className="text-xs text-yellow-600 font-medium mt-1">
            Unlocked {date}
          </p>
        )}
      </div>
      {unlocked && (
        <div className="flex-shrink-0">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      )}
    </div>
  );
}