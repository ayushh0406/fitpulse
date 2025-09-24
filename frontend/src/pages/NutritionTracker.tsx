import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { Plus, ChevronLeft, ChevronRight, PlusCircle, Info } from "lucide-react";
import { useNutritionStore, Meal } from '@/lib/nutrition';
import MealForm from '@/components/nutrition/MealForm';
import { CalorieCalculator } from '@/components/nutrition/CalorieCalculator';

const NutritionTracker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMealForm, setShowMealForm] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const { toast } = useToast();
  
  const { 
    getMealsByDate, 
    getDailyNutrition,
    addMeal,
    removeMeal,
    dailyGoal,
    setDailyGoal
  } = useNutritionStore();
  
  const meals = getMealsByDate(selectedDate.toISOString());
  const { consumed, percentage } = getDailyNutrition(selectedDate.toISOString());
  
  // Helper function to handle date navigation
  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };
  
  // Handle meal form submission
  const handleMealSubmit = (meal: Omit<Meal, 'id'>) => {
    addMeal({
      ...meal,
      date: selectedDate.toISOString(),
    });
    
    toast({
      title: "Meal Added",
      description: `${meal.name} has been added to your food log`,
    });
    
    setShowMealForm(false);
  };
  
  // Handle meal deletion
  const handleDeleteMeal = (id: string) => {
    removeMeal(id);
    
    toast({
      title: "Meal Removed",
      description: "Meal has been removed from your food log",
    });
  };
  
  // Handle daily goal update from calculator
  const handleGoalUpdate = (newGoal: any) => {
    setDailyGoal(newGoal);
    
    toast({
      title: "Daily Goals Updated",
      description: "Your nutrition targets have been updated",
    });
    
    setShowCalculator(false);
  };
  
  // Group meals by type
  const mealsByType = meals.reduce((acc, meal) => {
    if (!acc[meal.mealType]) {
      acc[meal.mealType] = [];
    }
    acc[meal.mealType].push(meal);
    return acc;
  }, {} as Record<string, Meal[]>);
  
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="heading-brutal text-3xl lg:text-4xl font-black mb-2 text-center">
          Nutrition <span className="text-fitness-green">Tracker</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8 text-center">
          Track your meals, monitor your nutrients, and stay on top of your goals
        </p>
        
        {/* Date Navigation */}
        <div className="flex items-center justify-center mb-6 space-x-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => changeDate(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <h2 className="text-xl font-bold">
            {selectedDate.toDateString() === new Date().toDateString() 
              ? "Today" 
              : format(selectedDate, 'EEEE, MMM d, yyyy')}
          </h2>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => changeDate(1)}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Nutrition Summary Card */}
        <Card className="brutal-card mb-8">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Daily Nutrition</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                className="text-fitness-green border-fitness-green hover:bg-fitness-green hover:text-white"
                onClick={() => setShowCalculator(true)}
              >
                <Info className="h-4 w-4 mr-2" />
                Calculate Needs
              </Button>
            </div>
            <CardDescription>
              Track your daily nutrient intake against your goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Calories</span>
                  <span>{consumed.calories} / {dailyGoal.calories} kcal</span>
                </div>
                <Progress value={percentage.calories} className="h-2" />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Protein</span>
                    <span>{consumed.protein}g / {dailyGoal.protein}g</span>
                  </div>
                  <Progress value={percentage.protein} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Carbs</span>
                    <span>{consumed.carbs}g / {dailyGoal.carbs}g</span>
                  </div>
                  <Progress value={percentage.carbs} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fat</span>
                    <span>{consumed.fat}g / {dailyGoal.fat}g</span>
                  </div>
                  <Progress value={percentage.fat} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Meals Tabs */}
        <Tabs defaultValue="breakfast" className="w-full mb-6">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
            <TabsTrigger value="lunch">Lunch</TabsTrigger>
            <TabsTrigger value="dinner">Dinner</TabsTrigger>
            <TabsTrigger value="snack">Snacks</TabsTrigger>
          </TabsList>
          
          {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => (
            <TabsContent key={mealType} value={mealType}>
              <Card className="brutal-card">
                <CardHeader className="pb-2">
                  <CardTitle className="capitalize">{mealType}</CardTitle>
                  <CardDescription>
                    {mealsByType[mealType]?.length 
                      ? `${mealsByType[mealType].length} items logged` 
                      : `No ${mealType} logged yet`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mealsByType[mealType]?.map((meal) => (
                      <div key={meal.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{meal.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {meal.calories} kcal • {meal.protein}g protein • {meal.carbs}g carbs • {meal.fat}g fat
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteMeal(meal.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-dashed border-2 text-muted-foreground hover:text-fitness-green hover:border-fitness-green"
                      onClick={() => setShowMealForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Food
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Quick Add Button */}
        <div className="fixed bottom-6 right-6">
          <Button 
            className="btn-brutal-primary h-14 w-14 rounded-full shadow-lg"
            onClick={() => setShowMealForm(true)}
          >
            <PlusCircle className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {/* Meal Form Dialog */}
      {showMealForm && (
        <MealForm 
          onSubmit={handleMealSubmit} 
          onCancel={() => setShowMealForm(false)} 
        />
      )}
      
      {/* Calorie Calculator Dialog */}
      {showCalculator && (
        <CalorieCalculator 
          currentGoal={dailyGoal}
          onSave={handleGoalUpdate}
          onCancel={() => setShowCalculator(false)}
        />
      )}
    </div>
  );
};

export default NutritionTracker;