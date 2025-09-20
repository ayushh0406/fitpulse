import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dumbbell, Plus, Save, Trash2, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MotivationalQuote from "@/components/MotivationalQuote";

interface WorkoutSet {
  id: string;
  routine: string;
  reps: number;
  weight: number;
  timestamp: Date;
}

// Fetch these from an API in a real application
const [routines, setRoutines] = useState([
  "Chest Day",
  "Legs",
  "Full Body",
  "Back & Biceps",
  "Shoulders & Triceps",
  "HIIT Cardio",
  "Core Blast"
]);

// In a real application, this would come from an API
const [workoutSuggestions, setWorkoutSuggestions] = useState({
  "Chest Day": ["Bench Press", "Push-ups", "Dumbbell Flyes", "Incline Press"],
  "Legs": ["Squats", "Deadlifts", "Leg Press", "Lunges"],
  "Full Body": ["Deadlifts", "Burpees", "Thrusters", "Pull-ups"],
  "Back & Biceps": ["Pull-ups", "Rows", "Lat Pulldowns", "Bicep Curls"],
  "Shoulders & Triceps": ["Overhead Press", "Lateral Raises", "Tricep Dips", "Arnold Press"],
  "HIIT Cardio": ["Mountain Climbers", "Jump Squats", "High Knees", "Burpees"],
  "Core Blast": ["Planks", "Russian Twists", "Dead Bugs", "Bicycle Crunches"]
});

const LogWorkout = () => {
  const [selectedRoutine, setSelectedRoutine] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [workoutSets, setWorkoutSets] = useState<WorkoutSet[]>([]);
  const [showQuote, setShowQuote] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved workouts from localStorage
    const savedWorkouts = localStorage.getItem('fitpulse-workouts');
    if (savedWorkouts) {
      setWorkoutSets(JSON.parse(savedWorkouts));
    }
    
    // Fetch workout data from API
    const fetchWorkoutData = async () => {
      try {
        // API call to get workout routines and suggestions
        try {
          const response = await fetch('http://localhost:8000/workout-routines');
          if (response.ok) {
            const data = await response.json();
            console.log("Workout data fetched from API:", data);
            setRoutines(data.routines);
            setWorkoutSuggestions(data.suggestions);
          } else {
            // If API call fails, we keep the initial state (already defined)
            console.log("API call failed, using default data");
          }
        } catch (error) {
          // If there's an error (e.g. backend not running), we keep the initial state
          console.error("Error fetching workout data:", error);
          toast({
            title: "Connection Error",
            description: "Using offline data. Connect to backend for real-time features.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error in workout data fetching:", error);
      }
    };
    
    fetchWorkoutData();
  }, [toast]);

  const addSet = () => {
    if (!selectedRoutine || !reps || !weight) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to add a set.",
        variant: "destructive",
      });
      return;
    }

    const newSet: WorkoutSet = {
      id: Date.now().toString(),
      routine: selectedRoutine,
      reps: parseInt(reps),
      weight: parseFloat(weight),
      timestamp: new Date(),
    };

    const updatedSets = [...workoutSets, newSet];
    setWorkoutSets(updatedSets);
    
    // Clear form
    setReps("");
    setWeight("");
    
    // Add animation and toast
    toast({
      title: "Set Added! 💪",
      description: `${selectedRoutine}: ${reps} reps @ ${weight}kg`,
    });

    // Trigger barbell spin animation (simulated)
    const addButton = document.querySelector('.add-set-btn') as HTMLElement;
    addButton?.classList.add('confetti-burst');
    setTimeout(() => addButton?.classList.remove('confetti-burst'), 500);
  };

  const removeSet = (id: string) => {
    const updatedSets = workoutSets.filter(set => set.id !== id);
    setWorkoutSets(updatedSets);
    
    toast({
      title: "Set Removed",
      description: "Set has been deleted from your workout.",
    });
  };

  const saveWorkout = async () => {
    if (workoutSets.length === 0) {
      toast({
        title: "No Sets to Save",
        description: "Add some sets before saving your workout.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Save to both API and localStorage for redundancy
      let apiSaveSuccessful = false;
      
      // Try to save to the API first
      try {
        const response = await fetch('http://localhost:8000/save-workout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ workoutSets }),
        });
        
        if (response.ok) {
          apiSaveSuccessful = true;
          console.log("Workout saved to API successfully");
        } else {
          console.log("API save failed, falling back to localStorage");
        }
      } catch (error) {
        console.error("API save error, using localStorage instead:", error);
      }
      
      // Always save to localStorage as backup
      localStorage.setItem('fitpulse-workouts', JSON.stringify(workoutSets));
      
      // Update streak counter
      updateStreak();
      
      // Show motivational quote
      setShowQuote(true);
      
      // Trigger confetti animation
      const saveButton = document.querySelector('.save-workout-btn') as HTMLElement;
      saveButton?.classList.add('confetti-burst');
      setTimeout(() => saveButton?.classList.remove('confetti-burst'), 1000);
      
      toast({
        title: "Workout Saved! 🔥",
        description: `${workoutSets.length} sets logged successfully${apiSaveSuccessful ? ' to cloud' : ''}. You're crushing it!`,
      });

      // Clear workout after a delay
      setTimeout(() => {
        setWorkoutSets([]);
        setShowQuote(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving workout:", error);
      toast({
        title: "Save Failed",
        description: "There was a problem saving your workout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const streakData = localStorage.getItem('fitpulse-streak');
    
    if (streakData) {
      const { lastWorkout, streakCount } = JSON.parse(streakData);
      const lastDate = new Date(lastWorkout).toDateString();
      
      if (lastDate !== today) {
        const newStreak = streakCount + 1;
        localStorage.setItem('fitpulse-streak', JSON.stringify({
          lastWorkout: today,
          streakCount: newStreak
        }));
      }
    } else {
      localStorage.setItem('fitpulse-streak', JSON.stringify({
        lastWorkout: today,
        streakCount: 1
      }));
    }
  };

  const suggestWorkout = () => {
    if (!selectedRoutine) {
      toast({
        title: "Select a Routine First",
        description: "Choose a routine to get personalized exercise suggestions.",
        variant: "destructive",
      });
      return;
    }

    const suggestions = workoutSuggestions[selectedRoutine as keyof typeof workoutSuggestions];
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setSuggestion(`Try ${randomSuggestion} for ${selectedRoutine}! Perfect for building strength and muscle.`);
    setShowSuggestion(true);
    
    toast({
      title: "Workout Suggestion! 💡",
      description: `How about trying ${randomSuggestion}?`,
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <Dumbbell className="h-16 w-16 text-fitness-green pulse-green" />
          </div>
          <h1 className="heading-brutal text-3xl lg:text-4xl font-black mb-2">
            Log Your <span className="text-fitness-green">Workout</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Track every rep, every set, every victory
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="brutal-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center space-x-2">
                <Plus className="h-5 w-5 text-fitness-green" />
                <span>Add New Set</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="routine" className="font-semibold">Routine</Label>
                <Select value={selectedRoutine} onValueChange={setSelectedRoutine}>
                  <SelectTrigger className="input-brutal">
                    <SelectValue placeholder="Select a routine" />
                  </SelectTrigger>
                  <SelectContent>
                    {routines.map((routine) => (
                      <SelectItem key={routine} value={routine}>
                        {routine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reps" className="font-semibold">Reps</Label>
                  <Input
                    id="reps"
                    type="number"
                    placeholder="1-50"
                    min="1"
                    max="50"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="input-brutal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight" className="font-semibold">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="0-300"
                    min="0"
                    max="300"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="input-brutal"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={suggestWorkout}
                  variant="outline"
                  className="w-full py-3 text-lg font-bold border-4 border-fitness-green text-fitness-green hover:bg-fitness-green hover:text-white transition-all"
                >
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Suggest Workout
                </Button>
                
                <Button 
                  onClick={addSet}
                  className="add-set-btn btn-brutal-primary w-full py-3 text-lg font-bold hover:scale-105 transition-transform"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Set
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Workout Sets List */}
          <Card className="brutal-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center justify-between">
                <span>Current Workout</span>
                <span className="text-fitness-green">{workoutSets.length} sets</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workoutSets.length === 0 ? (
                <div className="text-center py-8">
                  <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No sets logged yet</p>
                  <p className="text-sm text-muted-foreground">Add your first set above!</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {workoutSets.map((set, index) => (
                      <div 
                        key={set.id} 
                        className="slide-up bg-muted rounded-lg p-3 flex items-center justify-between border border-border"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div>
                          <p className="font-semibold">{set.routine}</p>
                          <p className="text-sm text-muted-foreground">
                            {set.reps} reps @ {set.weight}kg
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSet(set.id)}
                          className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={saveWorkout}
                    className="save-workout-btn btn-brutal-primary w-full py-3 text-lg font-bold hover:scale-105 transition-transform"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Save Workout
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Workout Suggestion */}
        {showSuggestion && (
          <Card className="brutal-card mt-8 slide-up">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Lightbulb className="h-6 w-6 text-fitness-green" />
                <h3 className="text-xl font-bold">Workout Suggestion</h3>
              </div>
              <p className="text-muted-foreground">{suggestion}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowSuggestion(false)}
                className="mt-3"
              >
                Got it!
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Motivational Quote */}
        {showQuote && (
          <div className="mt-8 bounce-in">
            <MotivationalQuote />
          </div>
        )}
      </div>
    </div>
  );
};

export default LogWorkout;