import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Heart, Share, Copy, Trophy, Target, Zap, Brain } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";

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
                <div className="min-h-screen bg-background py-8 flex items-center justify-center">
                  <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="heading-brutal text-3xl lg:text-4xl font-black mb-8 text-center">
                      Progress & <span className="text-fitness-green">Community</span>
                    </h1>
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                      <p className="text-lg text-muted-foreground mb-4">
                        All static/demo data has been removed.<br />
                        Please connect to real user data to display progress and community feed.
                      </p>
                    </div>
                  </div>
                </div>
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