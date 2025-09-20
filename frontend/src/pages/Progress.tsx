import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Chart } from "@/components/ui/chart";
import { Trophy, Calendar, Dumbbell, TrendingUp, Medal } from "lucide-react";

const Progress = () => {
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await fetch('http://localhost:8000/user-progress/default');
        
        if (response.ok) {
          const data = await response.json();
          setProgressData(data);
          setLoading(false);
        } else {
          setError('Failed to fetch progress data');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching progress data:', error);
        setError('Connection error. Is the backend server running?');
        setLoading(false);
        toast({
          title: "Connection Error",
          description: "Unable to connect to progress data. Using offline mode.",
          variant: "destructive",
        });
      }
    };

    fetchProgressData();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <Dumbbell className="h-16 w-16 mx-auto mb-4 text-fitness-green animate-bounce" />
            <p className="text-xl">Loading your progress data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !progressData) {
    return (
      <div className="min-h-screen bg-background py-8 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="heading-brutal text-3xl lg:text-4xl font-black mb-8 text-center">
            Progress & <span className="text-fitness-green">Community</span>
          </h1>
          <Card className="brutal-card">
            <CardContent className="p-8 text-center">
              <p className="text-lg text-muted-foreground mb-4">
                {error || "Unable to load progress data."}
                <br />
                Check your connection to the backend server.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Format the weekly progress data for the chart
  const chartData = {
    labels: progressData.weekly_progress.map((day: any) => day.day),
    datasets: [
      {
        label: 'Sets Completed',
        data: progressData.weekly_progress.map((day: any) => day.sets),
        backgroundColor: '#4ADE80',
        borderColor: '#22c55e',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="heading-brutal text-3xl lg:text-4xl font-black mb-8 text-center">
          Progress & <span className="text-fitness-green">Community</span>
        </h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="brutal-card">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="bg-fitness-green/10 p-3 rounded-full">
                <Trophy className="h-8 w-8 text-fitness-green" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Workout Streak</p>
                <h3 className="text-2xl font-bold">{progressData.workout_streak} days</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="brutal-card">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="bg-fitness-green/10 p-3 rounded-full">
                <Calendar className="h-8 w-8 text-fitness-green" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Workouts</p>
                <h3 className="text-2xl font-bold">{progressData.workout_count}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="brutal-card">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="bg-fitness-green/10 p-3 rounded-full">
                <Dumbbell className="h-8 w-8 text-fitness-green" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sets</p>
                <h3 className="text-2xl font-bold">{progressData.total_sets}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Weekly Progress Chart */}
        <Card className="brutal-card mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-fitness-green mr-2" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Chart
              type="bar"
              data={chartData}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Sets Completed',
                    },
                  },
                },
              }}
              className="h-64"
            />
          </CardContent>
        </Card>
        
        {/* Monthly Summary */}
        <Card className="brutal-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center space-x-2">
              <Medal className="h-5 w-5 text-fitness-green mr-2" />
              Monthly Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Workouts</p>
                <h3 className="text-2xl font-bold">{progressData.monthly_summary.total_workouts}</h3>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Avg Sets Per Workout</p>
                <h3 className="text-2xl font-bold">{progressData.monthly_summary.avg_sets_per_workout}</h3>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Most Improved</p>
                <h3 className="text-xl font-bold">{progressData.monthly_summary.most_improved}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;