import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Heart, Share, Copy, Trophy, Target, Zap, Brain } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";

// Mock progress data
const mockProgressData = [
  { session: 1, weight: 50, date: "Jan 1" },
  { session: 2, weight: 55, date: "Jan 8" },
  { session: 3, weight: 60, date: "Jan 15" },
  { session: 4, weight: 65, date: "Jan 22" },
  { session: 5, weight: 70, date: "Jan 29" },
];

// Mock community feed
const communityFeed = [
  {
    id: 1,
    user: "Alex M.",
    action: "just crushed a 100kg bench press! 🔥",
    time: "2 mins ago",
    likes: 24,
  },
  {
    id: 2,
    user: "Sarah K.",
    action: "completed an epic leg day session 🦵",
    time: "15 mins ago",
    likes: 18,
  },
  {
    id: 3,
    user: "Mike R.",
    action: "shared his full body routine 💪",
    time: "1 hour ago",
    likes: 31,
  },
  {
    id: 4,
    user: "Emma L.",
    action: "hit a new deadlift PR - 120kg! 🎯",
    time: "2 hours ago",
    likes: 42,
  },
];

const Progress = () => {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [chartAnimated, setChartAnimated] = useState(false);
  const [progressInsight, setProgressInsight] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Trigger chart animation on mount
    setTimeout(() => setChartAnimated(true), 500);
    
    // Generate progress insight
    generateProgressInsight();
  }, []);

  const generateProgressInsight = () => {
    const savedWorkouts = localStorage.getItem('fitpulse-workouts');
    
    if (savedWorkouts) {
      const workouts = JSON.parse(savedWorkouts);
      const totalWeight = workouts.reduce((sum: number, workout: any) => sum + workout.weight, 0);
      const totalReps = workouts.reduce((sum: number, workout: any) => sum + workout.reps, 0);
      
      if (totalWeight > 0) {
        setProgressInsight(`Amazing! You've lifted ${totalWeight}kg total across ${workouts.length} sets with ${totalReps} reps. That's like lifting a small car! 🚗💪`);
      } else {
        setProgressInsight("You lifted 500kg more this week! Your strength gains are off the charts. Keep crushing those PRs! 💪🔥");
      }
    } else {
      setProgressInsight("You lifted 500kg more this week! Your strength gains are off the charts. Keep crushing those PRs! 💪🔥");
    }
  };

  const handleLike = (postId: number) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
    
    // Heart bounce animation
    const button = document.querySelector(`[data-post-id="${postId}"]`) as HTMLElement;
    button?.classList.add('confetti-burst');
    setTimeout(() => button?.classList.remove('confetti-burst'), 300);
    
    toast({
      title: likedPosts.includes(postId) ? "Unliked! 💔" : "Liked! ❤️",
      description: "Keep supporting your fitness family!",
    });
  };

  const handleShare = (postId: number, user: string, action: string) => {
    const shareText = `Check out what ${user} ${action} on FitPulse! 💪 #FitPulse #Fitness`;
    navigator.clipboard.writeText(shareText);
    
    toast({
      title: "Copied to Clipboard! 📋",
      description: "Share this achievement with your friends!",
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <BarChart3 className="h-16 w-16 text-fitness-green pulse-green" />
          </div>
          <h1 className="heading-brutal text-3xl lg:text-4xl font-black mb-2">
            Progress & <span className="text-fitness-green">Community</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your gains and connect with fellow warriors
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="brutal-card hover:scale-105 transition-transform">
            <CardContent className="p-6 text-center">
              <div className="bg-fitness-green p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-fitness-green">127</p>
              <p className="text-sm text-muted-foreground font-medium">Total Workouts</p>
            </CardContent>
          </Card>
          
          <Card className="brutal-card hover:scale-105 transition-transform">
            <CardContent className="p-6 text-center">
              <div className="bg-fitness-green p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-fitness-green">18</p>
              <p className="text-sm text-muted-foreground font-medium">Week Streak</p>
            </CardContent>
          </Card>
          
          <Card className="brutal-card hover:scale-105 transition-transform">
            <CardContent className="p-6 text-center">
              <div className="bg-fitness-green p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-fitness-green">2,847</p>
              <p className="text-sm text-muted-foreground font-medium">Total Reps</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Progress Chart */}
          <Card className="brutal-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-fitness-green" />
                <span>Weight Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#666"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#666"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "white",
                        border: "4px solid black",
                        borderRadius: "8px",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.3)"
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="hsl(var(--fitness-green))"
                      strokeWidth={4}
                      dot={{ 
                        fill: "hsl(var(--fitness-green))", 
                        r: 6,
                        className: chartAnimated ? "pulse-green" : ""
                      }}
                      activeDot={{ 
                        r: 8, 
                        fill: "hsl(var(--fitness-green))",
                        className: "pulse-green"
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-fitness-green text-white rounded-lg text-center">
                <p className="font-bold text-lg">+20kg Progress! 🚀</p>
                <p className="text-sm opacity-90">You're absolutely crushing it!</p>
              </div>
            </CardContent>
          </Card>

          {/* Progress Insights */}
          <Card className="brutal-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center space-x-2">
                <Brain className="h-5 w-5 text-fitness-green" />
                <span>Progress Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 confetti-burst">
                <div className="bg-fitness-green p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <p className="text-muted-foreground mb-4">{progressInsight}</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-fitness-green">85%</p>
                    <p className="text-sm text-muted-foreground">Consistency</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-fitness-green">+12%</p>
                    <p className="text-sm text-muted-foreground">Strength Gain</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Feed */}
          <Card className="brutal-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center space-x-2">
                <Heart className="h-5 w-5 text-fitness-green" />
                <span>Community Feed</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {communityFeed.map((post, index) => (
                  <div 
                    key={post.id}
                    className="slide-up p-4 bg-muted rounded-lg border border-border hover:shadow-lg transition-all"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">{post.user}</p>
                        <p className="text-sm text-muted-foreground">{post.time}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          data-post-id={post.id}
                          className={`transition-all ${
                            likedPosts.includes(post.id)
                              ? "bg-red-50 border-red-300 text-red-600 hover:bg-red-100"
                              : "hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                          }`}
                        >
                          <Heart 
                            className={`h-4 w-4 ${
                              likedPosts.includes(post.id) ? "fill-current" : ""
                            }`} 
                          />
                          <span className="ml-1 text-xs">{post.likes}</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare(post.id, post.user, post.action)}
                          className="hover:bg-fitness-green hover:text-white transition-all"
                        >
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm">{post.action}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Banner */}
        <Card className="brutal-card mt-8 bg-gradient-to-r from-fitness-green to-fitness-green-dark text-white">
          <CardContent className="p-8 text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">You're on Fire! 🔥</h3>
            <p className="text-lg opacity-90">
              18-week streak and counting. Keep dominating your fitness journey!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;