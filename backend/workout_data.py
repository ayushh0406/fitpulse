# workout_data.py
from typing import Dict, List, Any

# Mock workout data that would normally come from a database
WORKOUT_ROUTINES = [
  "Chest Day",
  "Legs",
  "Full Body",
  "Back & Biceps",
  "Shoulders & Triceps",
  "HIIT Cardio",
  "Core Blast"
]

WORKOUT_SUGGESTIONS = {
  "Chest Day": ["Bench Press", "Push-ups", "Dumbbell Flyes", "Incline Press"],
  "Legs": ["Squats", "Deadlifts", "Leg Press", "Lunges"],
  "Full Body": ["Deadlifts", "Burpees", "Thrusters", "Pull-ups"],
  "Back & Biceps": ["Pull-ups", "Rows", "Lat Pulldowns", "Bicep Curls"],
  "Shoulders & Triceps": ["Overhead Press", "Lateral Raises", "Tricep Dips", "Arnold Press"],
  "HIIT Cardio": ["Mountain Climbers", "Jump Squats", "High Knees", "Burpees"],
  "Core Blast": ["Planks", "Russian Twists", "Dead Bugs", "Bicycle Crunches"]
}

def get_workout_data() -> Dict[str, Any]:
    """Return all workout routines and suggestions"""
    return {
        "routines": WORKOUT_ROUTINES,
        "suggestions": WORKOUT_SUGGESTIONS
    }

def save_workout(workout_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    In a real application, this would save the workout data to a database
    For now, we'll just return a success message
    """
    # Here you would normally:
    # 1. Validate the input data
    # 2. Connect to a database
    # 3. Save the workout data
    # 4. Return a success response or error
    
    return {
        "status": "success",
        "message": f"Successfully saved workout with {len(workout_data.get('workoutSets', []))} sets"
    }

def get_user_progress(user_id: str = "default") -> Dict[str, Any]:
    """
    In a real application, this would retrieve the user's progress from a database
    For now, we'll return mock data
    """
    # Mock data representing a user's workout progress over time
    return {
        "user_id": user_id,
        "workout_count": 24,
        "total_sets": 142,
        "workout_streak": 3,
        "favorite_routine": "Chest Day",
        "weekly_progress": [
            {"day": "Monday", "sets": 12},
            {"day": "Tuesday", "sets": 0},
            {"day": "Wednesday", "sets": 15},
            {"day": "Thursday", "sets": 0},
            {"day": "Friday", "sets": 10},
            {"day": "Saturday", "sets": 0},
            {"day": "Sunday", "sets": 0}
        ],
        "monthly_summary": {
            "total_workouts": 8,
            "avg_sets_per_workout": 5.6,
            "most_improved": "Bench Press"
        }
    }