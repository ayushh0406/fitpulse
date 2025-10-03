import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Play, Pause, Square, RotateCcw } from 'lucide-react';

interface WorkoutTimerProps {
  onComplete?: (duration: number) => void;
  className?: string;
}

export function WorkoutTimer({ onComplete, className }: WorkoutTimerProps) {
  const [time, setTime] = useState(0); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    if (onComplete && time > 0) {
      onComplete(time);
    }
    setTime(0);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="text-center">Workout Timer</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="text-4xl font-mono font-bold text-fitness-green">
          {formatTime(time)}
        </div>
        
        <div className="flex justify-center space-x-2">
          {!isRunning || isPaused ? (
            <Button onClick={handleStart} className="bg-fitness-green hover:bg-green-600">
              <Play className="h-4 w-4 mr-2" />
              {isPaused ? 'Resume' : 'Start'}
            </Button>
          ) : (
            <Button onClick={handlePause} variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          
          <Button onClick={handleStop} variant="outline">
            <Square className="h-4 w-4 mr-2" />
            Stop
          </Button>
          
          <Button onClick={handleReset} variant="ghost">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
        
        {time > 0 && (
          <div className="text-sm text-muted-foreground">
            {time < 60 
              ? `${time} seconds` 
              : time < 3600 
                ? `${Math.floor(time / 60)} minutes ${time % 60} seconds`
                : `${Math.floor(time / 3600)} hours ${Math.floor((time % 3600) / 60)} minutes`
            }
          </div>
        )}
      </CardContent>
    </Card>
  );
}