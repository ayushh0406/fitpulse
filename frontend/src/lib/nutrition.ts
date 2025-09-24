// src/lib/nutrition.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string; // ISO string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  image?: string;
}

export interface DailyNutritionGoal {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  image?: string;
  tags: string[];
}

interface NutritionState {
  meals: Meal[];
  dailyGoal: DailyNutritionGoal;
  savedRecipes: Recipe[];
  
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  removeMeal: (id: string) => void;
  updateMeal: (id: string, meal: Partial<Meal>) => void;
  
  setDailyGoal: (goal: DailyNutritionGoal) => void;
  
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  removeRecipe: (id: string) => void;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  
  getMealsByDate: (date: string) => Meal[];
  getDailyNutrition: (date: string) => {
    consumed: DailyNutritionGoal;
    remaining: DailyNutritionGoal;
    percentage: DailyNutritionGoal;
  };
}

// Sample recipes data
const SAMPLE_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Protein Oatmeal Bowl',
    calories: 350,
    protein: 25,
    carbs: 45,
    fat: 8,
    ingredients: [
      '1 cup rolled oats',
      '1 scoop protein powder',
      '1 tbsp peanut butter',
      '1 banana',
      'Cinnamon to taste',
      'Water or almond milk'
    ],
    instructions: [
      'Combine oats and water/milk in a pot and bring to a simmer',
      'Cook for 3-5 minutes until oats are soft',
      'Stir in protein powder',
      'Top with sliced banana, peanut butter, and cinnamon'
    ],
    prepTime: 2,
    cookTime: 5,
    servings: 1,
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-4.0.3',
    tags: ['breakfast', 'high-protein', 'vegetarian']
  },
  {
    id: '2',
    name: 'Chicken & Vegetable Stir Fry',
    calories: 420,
    protein: 35,
    carbs: 30,
    fat: 15,
    ingredients: [
      '200g chicken breast',
      '1 cup broccoli florets',
      '1 bell pepper',
      '1 carrot',
      '2 tbsp low-sodium soy sauce',
      '1 tbsp olive oil',
      '1 clove garlic, minced',
      '1 tsp ginger, grated'
    ],
    instructions: [
      'Slice chicken into thin strips',
      'Heat oil in a pan over medium-high heat',
      'Add chicken and cook until no longer pink',
      'Add vegetables, garlic and ginger, stir fry for 3-5 minutes',
      'Add soy sauce and cook for another 2 minutes',
      'Serve hot, optionally over rice or noodles'
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3',
    tags: ['lunch', 'dinner', 'high-protein', 'low-carb']
  },
  {
    id: '3',
    name: 'Greek Yogurt Parfait',
    calories: 280,
    protein: 20,
    carbs: 35,
    fat: 6,
    ingredients: [
      '1 cup Greek yogurt',
      '1/4 cup granola',
      '1/2 cup mixed berries',
      '1 tbsp honey',
      'Mint leaves for garnish'
    ],
    instructions: [
      'Layer Greek yogurt in a glass or bowl',
      'Add a layer of mixed berries',
      'Sprinkle granola on top',
      'Drizzle with honey',
      'Garnish with mint leaves'
    ],
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3',
    tags: ['breakfast', 'snack', 'vegetarian', 'quick']
  }
];

// Default daily goal based on a general 2000 calorie diet
const DEFAULT_DAILY_GOAL: DailyNutritionGoal = {
  calories: 2000,
  protein: 150, // grams
  carbs: 225,   // grams
  fat: 65       // grams
};

// Create nutrition store with persistence
export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      meals: [],
      dailyGoal: DEFAULT_DAILY_GOAL,
      savedRecipes: SAMPLE_RECIPES,
      
      addMeal: (meal) => {
        set((state) => ({
          meals: [
            ...state.meals,
            {
              ...meal,
              id: `meal-${Date.now()}`
            }
          ]
        }));
      },
      
      removeMeal: (id) => {
        set((state) => ({
          meals: state.meals.filter((meal) => meal.id !== id)
        }));
      },
      
      updateMeal: (id, updatedMeal) => {
        set((state) => ({
          meals: state.meals.map((meal) => 
            meal.id === id ? { ...meal, ...updatedMeal } : meal
          )
        }));
      },
      
      setDailyGoal: (goal) => {
        set({ dailyGoal: goal });
      },
      
      addRecipe: (recipe) => {
        set((state) => ({
          savedRecipes: [
            ...state.savedRecipes,
            {
              ...recipe,
              id: `recipe-${Date.now()}`
            }
          ]
        }));
      },
      
      removeRecipe: (id) => {
        set((state) => ({
          savedRecipes: state.savedRecipes.filter((recipe) => recipe.id !== id)
        }));
      },
      
      updateRecipe: (id, updatedRecipe) => {
        set((state) => ({
          savedRecipes: state.savedRecipes.map((recipe) => 
            recipe.id === id ? { ...recipe, ...updatedRecipe } : recipe
          )
        }));
      },
      
      getMealsByDate: (date) => {
        return get().meals.filter((meal) => {
          const mealDate = new Date(meal.date).toDateString();
          const targetDate = new Date(date).toDateString();
          return mealDate === targetDate;
        });
      },
      
      getDailyNutrition: (date) => {
        const meals = get().getMealsByDate(date);
        const goal = get().dailyGoal;
        
        // Calculate consumed nutrition
        const consumed = meals.reduce(
          (acc, meal) => ({
            calories: acc.calories + meal.calories,
            protein: acc.protein + meal.protein,
            carbs: acc.carbs + meal.carbs,
            fat: acc.fat + meal.fat
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
        
        // Calculate remaining nutrition
        const remaining = {
          calories: Math.max(0, goal.calories - consumed.calories),
          protein: Math.max(0, goal.protein - consumed.protein),
          carbs: Math.max(0, goal.carbs - consumed.carbs),
          fat: Math.max(0, goal.fat - consumed.fat)
        };
        
        // Calculate percentage consumed
        const percentage = {
          calories: Math.min(100, (consumed.calories / goal.calories) * 100),
          protein: Math.min(100, (consumed.protein / goal.protein) * 100),
          carbs: Math.min(100, (consumed.carbs / goal.carbs) * 100),
          fat: Math.min(100, (consumed.fat / goal.fat) * 100)
        };
        
        return { consumed, remaining, percentage };
      }
    }),
    {
      name: 'fitpulse-nutrition-storage',
    }
  )
);