import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

interface WorkoutCardProps {
  title: string;
  duration: string;
  exercises: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  image?: string;
  onStart: () => void;
  className?: string;
}

export function WorkoutCard({ 
  title, 
  duration, 
  exercises, 
  difficulty, 
  category, 
  image, 
  onStart,
  className 
}: WorkoutCardProps) {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
    }
  };

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-200 cursor-pointer group", className)}>
      {image && (
        <div className="aspect-video bg-gradient-to-br from-fitness-green to-green-600 relative overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight">{title}</CardTitle>
          <Badge variant="secondary" className={getDifficultyColor()}>
            {difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>⏱️ {duration}</span>
          <span>🏋️ {exercises} exercises</span>
          <span>📂 {category}</span>
        </div>
        <button
          onClick={onStart}
          className="w-full bg-fitness-green hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Start Workout
        </button>
      </CardContent>
    </Card>
  );
}