import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, Download, Dumbbell, Flame } from "lucide-react";
import MotivationalQuote from "@/components/MotivationalQuote";
import heroImage from "@/assets/fitness-hero.jpg";

const Home = () => {
  const [animateHero, setAnimateHero] = useState(false);
  const [animateDumbbell, setAnimateDumbbell] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Trigger animations on mount
    setAnimateHero(true);
    const dumbbellTimer = setTimeout(() => setAnimateDumbbell(true), 500);
    
    // Load streak from localStorage
    loadStreak();
    
    return () => clearTimeout(dumbbellTimer);
  }, []);

  const loadStreak = () => {
    const streakData = localStorage.getItem('fitpulse-streak');
    if (streakData) {
      const { lastWorkout, streakCount } = JSON.parse(streakData);
      const today = new Date().toDateString();
      const lastDate = new Date(lastWorkout).toDateString();
      
      // Check if streak is still valid (within last 2 days)
      const daysDiff = Math.floor((new Date().getTime() - new Date(lastWorkout).getTime()) / (1000 * 3600 * 24));
      
      if (daysDiff <= 1) {
        setStreak(streakCount);
      } else {
        // Reset streak if more than 1 day gap
        setStreak(0);
        localStorage.setItem('fitpulse-streak', JSON.stringify({
          lastWorkout: today,
          streakCount: 0
        }));
      }
    } else {
      setStreak(3); // Default mock streak for demo
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background to-gray-50">
        <div className="absolute inset-0 opacity-10">
          <img 
            src={heroImage} 
            alt="Fitness equipment background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            {/* Animated Dumbbell Icon */}
            <div className={`inline-block mb-6 ${animateDumbbell ? 'bounce-in' : 'opacity-0'}`}>
              <div className="relative">
                <Dumbbell className="h-24 w-24 text-fitness-green mx-auto pulse-green" />
                <div className="absolute inset-0 animate-pulse">
                  <Dumbbell className="h-24 w-24 text-fitness-green opacity-20" />
                </div>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className={`heading-brutal text-4xl lg:text-6xl font-black mb-6 ${animateHero ? 'slide-up' : 'opacity-0'}`}>
              Power Your Workouts with{" "}
              <span className="text-fitness-green">FitPulse</span>
            </h1>

            {/* Rating Card */}
            <Card className={`brutal-card max-w-md mx-auto mb-8 ${animateHero ? 'slide-up' : 'opacity-0'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-fitness-green fill-current"
                    />
                  ))}
                  <span className="font-bold text-lg ml-2">4.9/5</span>
                </div>
                <p className="text-muted-foreground font-medium">
                  Trusted by 50K+ fitness enthusiasts
                </p>
                <Progress value={98} className="mt-3 h-3" />
              </CardContent>
            </Card>

            {/* Statistics Section */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 ${animateHero ? 'slide-up' : 'opacity-0'}`}>
              <Card className="brutal-card text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-black text-fitness-green mb-1">50K+</div>
                  <p className="text-sm text-muted-foreground font-medium">Active Users</p>
                </CardContent>
              </Card>
              <Card className="brutal-card text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-black text-fitness-green mb-1">1M+</div>
                  <p className="text-sm text-muted-foreground font-medium">Workouts Logged</p>
                </CardContent>
              </Card>
              <Card className="brutal-card text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-black text-fitness-green mb-1">500+</div>
                  <p className="text-sm text-muted-foreground font-medium">Exercises</p>
                </CardContent>
              </Card>
              <Card className="brutal-card text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-black text-fitness-green mb-1">24/7</div>
                  <p className="text-sm text-muted-foreground font-medium">Support</p>
                </CardContent>
              </Card>
            </div>

            {/* Streak Counter */}
            <Card className={`brutal-card max-w-md mx-auto mb-8 ${animateHero ? 'slide-up' : 'opacity-0'}`}>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <Flame className="h-8 w-8 text-orange-500 animate-pulse fire-animation" />
                  <div>
                    <p className="text-3xl font-black text-fitness-green">{streak}</p>
                    <p className="text-sm font-medium text-muted-foreground">Day Streak!</p>
                  </div>
                  <Flame className="h-8 w-8 text-orange-500 animate-pulse fire-animation" />
                </div>
                <p className="text-fitness-green font-bold">
                  {streak > 0 ? "You're on fire! Keep it burning! 🔥" : "Start your streak today! 💪"}
                </p>
              </CardContent>
            </Card>

            {/* Motivational Quote */}
            <div className={`max-w-lg mx-auto ${animateHero ? 'slide-up' : 'opacity-0'}`}>
              <MotivationalQuote />
            </div>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-brutal text-3xl font-black mb-4">
              Everything You Need to{" "}
              <span className="text-fitness-green">Dominate</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Log workouts, track progress, and connect with a community of fitness warriors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="brutal-card hover:scale-105 transition-transform">
              <CardContent className="p-8 text-center">
                <div className="bg-fitness-green p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Dumbbell className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Quick Logging</h3>
                <p className="text-muted-foreground">
                  Log your sets, reps, and weights in seconds with our intuitive interface.
                </p>
              </CardContent>
            </Card>

            <Card className="brutal-card hover:scale-105 transition-transform">
              <CardContent className="p-8 text-center">
                <div className="bg-fitness-green p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Track Progress</h3>
                <p className="text-muted-foreground">
                  Visualize your gains with beautiful charts and progress tracking.
                </p>
              </CardContent>
            </Card>

            <Card className="brutal-card hover:scale-105 transition-transform">
              <CardContent className="p-8 text-center">
                <div className="bg-fitness-green p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Download className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Community</h3>
                <p className="text-muted-foreground">
                  Share achievements and get motivated by fellow fitness enthusiasts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-brutal text-3xl font-black mb-4">
              What Our <span className="text-fitness-green">Warriors</span> Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="brutal-card">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-fitness-green fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "FitPulse completely changed my workout routine. The logging is so simple and the progress tracking keeps me motivated!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-fitness-green rounded-full flex items-center justify-center text-white font-bold mr-3">
                    M
                  </div>
                  <div>
                    <p className="font-semibold">Mike Chen</p>
                    <p className="text-sm text-muted-foreground">Powerlifter</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="brutal-card">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-fitness-green fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The community feature is amazing! Seeing others' progress pushes me to work harder every day."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-fitness-green rounded-full flex items-center justify-center text-white font-bold mr-3">
                    S
                  </div>
                  <div>
                    <p className="font-semibold">Sarah Wilson</p>
                    <p className="text-sm text-muted-foreground">Crossfit Athlete</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="brutal-card">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-fitness-green fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Best fitness app I've ever used. Clean design, powerful features, and those motivational quotes hit different!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-fitness-green rounded-full flex items-center justify-center text-white font-bold mr-3">
                    J
                  </div>
                  <div>
                    <p className="font-semibold">Jake Rodriguez</p>
                    <p className="text-sm text-muted-foreground">Bodybuilder</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6">
            <Dumbbell className="h-16 w-16 text-fitness-green mx-auto animate-bounce" />
          </div>
          <h2 className="heading-brutal text-3xl lg:text-4xl font-black mb-4">
            Ready to <span className="text-fitness-green">Transform</span> Your Fitness?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of fitness enthusiasts who are crushing their goals with FitPulse. 
            Start logging workouts, tracking progress, and connecting with the community today!
          </p>
          <Button 
            className="btn-brutal-primary px-8 py-3 text-lg font-bold hover:scale-105 transition-transform"
            onClick={() => {
              window.location.href = '/log-workout';
            }}
          >
            <Dumbbell className="h-5 w-5 mr-2" />
            Start Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;