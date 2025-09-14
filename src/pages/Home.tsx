import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, Download, Dumbbell } from "lucide-react";
import MotivationalQuote from "@/components/MotivationalQuote";
import heroImage from "@/assets/fitness-hero.jpg";

const Home = () => {
  const [animateHero, setAnimateHero] = useState(false);
  const [animateDumbbell, setAnimateDumbbell] = useState(false);

  useEffect(() => {
    // Trigger animations on mount
    setAnimateHero(true);
    const dumbbellTimer = setTimeout(() => setAnimateDumbbell(true), 500);
    
    return () => clearTimeout(dumbbellTimer);
  }, []);

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

            {/* Download Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 ${animateHero ? 'slide-up' : 'opacity-0'}`}>
              <Button 
                className="btn-brutal-primary w-full sm:w-auto px-8 py-3 text-lg font-bold hover:scale-105 transition-transform"
                onClick={() => {
                  // Add button bounce animation
                  const button = document.activeElement as HTMLElement;
                  button?.classList.add('confetti-burst');
                  setTimeout(() => button?.classList.remove('confetti-burst'), 1000);
                }}
              >
                <Download className="h-5 w-5 mr-2" />
                Download iOS
              </Button>
              <Button 
                className="btn-brutal-primary w-full sm:w-auto px-8 py-3 text-lg font-bold hover:scale-105 transition-transform"
                onClick={() => {
                  const button = document.activeElement as HTMLElement;
                  button?.classList.add('confetti-burst');
                  setTimeout(() => button?.classList.remove('confetti-burst'), 1000);
                }}
              >
                <Download className="h-5 w-5 mr-2" />
                Download Android
              </Button>
            </div>

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
    </div>
  );
};

export default Home;