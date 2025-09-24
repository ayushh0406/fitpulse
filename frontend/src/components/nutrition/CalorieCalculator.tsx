import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { DailyNutritionGoal } from '@/lib/nutrition';

interface CalorieCalculatorProps {
  currentGoal: DailyNutritionGoal;
  onSave: (goal: DailyNutritionGoal) => void;
  onCancel: () => void;
}

export const CalorieCalculator: React.FC<CalorieCalculatorProps> = ({
  currentGoal,
  onSave,
  onCancel,
}) => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(30);
  const [weight, setWeight] = useState<number>(70); // in kg
  const [height, setHeight] = useState<number>(170); // in cm
  const [activity, setActivity] = useState<number>(1.4); // activity multiplier
  const [goal, setGoal] = useState<'maintain' | 'lose' | 'gain'>('maintain');
  const [customGoal, setCustomGoal] = useState<DailyNutritionGoal>(currentGoal);
  const [useCustom, setUseCustom] = useState(false);
  
  // Calculate BMR using Mifflin-St Jeor Equation
  const calculateBMR = (): number => {
    if (gender === 'male') {
      return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
  };
  
  // Calculate daily calorie needs
  const calculateCalories = (): number => {
    let calories = calculateBMR() * activity;
    
    // Adjust based on goal
    switch (goal) {
      case 'lose':
        calories -= 500; // 500 calorie deficit for weight loss
        break;
      case 'gain':
        calories += 500; // 500 calorie surplus for weight gain
        break;
      default:
        break;
    }
    
    return Math.round(calories);
  };
  
  // Calculate macronutrients based on calories
  const calculateMacros = (calories: number): {protein: number, carbs: number, fat: number} => {
    let protein, carbs, fat;
    
    // Different macro ratios based on goal
    switch (goal) {
      case 'lose':
        // Higher protein, moderate fat, lower carbs for weight loss
        protein = Math.round((calories * 0.35) / 4); // 35% of calories from protein (4 calories per gram)
        fat = Math.round((calories * 0.30) / 9); // 30% of calories from fat (9 calories per gram)
        carbs = Math.round((calories * 0.35) / 4); // 35% of calories from carbs (4 calories per gram)
        break;
      case 'gain':
        // Higher carbs, moderate protein, lower fat for muscle gain
        protein = Math.round((calories * 0.25) / 4); // 25% of calories from protein
        fat = Math.round((calories * 0.25) / 9); // 25% of calories from fat
        carbs = Math.round((calories * 0.50) / 4); // 50% of calories from carbs
        break;
      default:
        // Balanced macros for maintenance
        protein = Math.round((calories * 0.30) / 4); // 30% of calories from protein
        fat = Math.round((calories * 0.30) / 9); // 30% of calories from fat
        carbs = Math.round((calories * 0.40) / 4); // 40% of calories from carbs
    }
    
    return { protein, carbs, fat };
  };
  
  // Calculate goals based on user input
  const calculateGoals = (): DailyNutritionGoal => {
    if (useCustom) {
      return customGoal;
    }
    
    const calories = calculateCalories();
    const macros = calculateMacros(calories);
    
    return {
      calories,
      ...macros
    };
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoals = calculateGoals();
    onSave(newGoals);
  };
  
  // Update custom goal when calculated values change
  const calculatedGoal = calculateGoals();
  
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Calculate Nutrition Needs</DialogTitle>
          <DialogDescription>
            Estimate your daily calorie and macronutrient targets based on your body and goals
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup 
                value={gender}
                onValueChange={(value) => setGender(value as 'male' | 'female')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="15"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="input-brutal"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="30"
                  max="250"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                  className="input-brutal"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                min="100"
                max="250"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="input-brutal"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="activity">Activity Level</Label>
              <Select
                value={activity.toString()}
                onValueChange={(value) => setActivity(parseFloat(value))}
              >
                <SelectTrigger className="input-brutal">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.2">Sedentary (little to no exercise)</SelectItem>
                  <SelectItem value="1.375">Light (exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="1.55">Moderate (exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="1.725">Active (exercise 6-7 days/week)</SelectItem>
                  <SelectItem value="1.9">Very Active (hard training 2x/day)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal">Goal</Label>
              <Select
                value={goal}
                onValueChange={(value) => setGoal(value as 'maintain' | 'lose' | 'gain')}
              >
                <SelectTrigger className="input-brutal">
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose">Lose Weight</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                  <SelectItem value="gain">Gain Muscle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useCustom"
                  checked={useCustom}
                  onChange={(e) => setUseCustom(e.target.checked)}
                  className="rounded border-border"
                />
                <Label htmlFor="useCustom">Use custom values</Label>
              </div>
              
              {useCustom ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Calories (kcal)</Label>
                    <Input
                      type="number"
                      min="1000"
                      max="5000"
                      value={customGoal.calories}
                      onChange={(e) => setCustomGoal({...customGoal, calories: parseInt(e.target.value)})}
                      className="input-brutal"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Protein (g)</Label>
                    <Input
                      type="number"
                      min="50"
                      max="300"
                      value={customGoal.protein}
                      onChange={(e) => setCustomGoal({...customGoal, protein: parseInt(e.target.value)})}
                      className="input-brutal"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Carbs (g)</Label>
                    <Input
                      type="number"
                      min="50"
                      max="500"
                      value={customGoal.carbs}
                      onChange={(e) => setCustomGoal({...customGoal, carbs: parseInt(e.target.value)})}
                      className="input-brutal"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Fat (g)</Label>
                    <Input
                      type="number"
                      min="20"
                      max="200"
                      value={customGoal.fat}
                      onChange={(e) => setCustomGoal({...customGoal, fat: parseInt(e.target.value)})}
                      className="input-brutal"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-muted rounded-lg p-4 space-y-3">
                  <p className="font-semibold text-center text-lg">Calculated Daily Goals</p>
                  <div className="space-y-1">
                    <p>Calories: <span className="font-semibold">{calculatedGoal.calories} kcal</span></p>
                    <p>Protein: <span className="font-semibold">{calculatedGoal.protein}g</span> ({Math.round((calculatedGoal.protein * 4 / calculatedGoal.calories) * 100)}%)</p>
                    <p>Carbs: <span className="font-semibold">{calculatedGoal.carbs}g</span> ({Math.round((calculatedGoal.carbs * 4 / calculatedGoal.calories) * 100)}%)</p>
                    <p>Fat: <span className="font-semibold">{calculatedGoal.fat}g</span> ({Math.round((calculatedGoal.fat * 9 / calculatedGoal.calories) * 100)}%)</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="btn-brutal-primary">
              Set Goals
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};