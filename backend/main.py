
from fastapi import FastAPI, File, UploadFile, Query, WebSocket, WebSocketDisconnect, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import mediapipe as mp
import numpy as np
from PIL import Image
import io
import base64
import re
import json
from enum import Enum
from typing import Tuple, Dict, List, Optional
from food_analysis import analyze_nutrition
from workout_data import get_workout_data, save_workout, get_user_progress

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

class ExerciseType(str, Enum):
    SQUAT = "squat"
    PUSHUP = "pushup"
    PLANK = "plank"
    LUNGE = "lunge"
    GENERAL = "general"

def get_angle(a: np.ndarray, b: np.ndarray, c: np.ndarray) -> float:
    """Calculate the angle between three points in degrees."""
    ba = a - b
    bc = c - b
    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
    # Ensure the value is within valid range for arccos
    cosine_angle = np.clip(cosine_angle, -1.0, 1.0)
    angle = np.arccos(cosine_angle)
    return np.degrees(angle)

def get_landmark_coords(landmarks, landmark_index) -> np.ndarray:
    """Extract x, y, z coordinates from landmark."""
    lm = landmarks[landmark_index]
    return np.array([lm.x, lm.y, lm.z])

def analyze_image_posture(image_bytes, exercise_type: ExerciseType = ExerciseType.GENERAL):
    """Analyze posture from an image based on exercise type."""
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img_np = np.array(image)
    
    # Process image with MediaPipe
    with mp_pose.Pose(static_image_mode=True, model_complexity=2, min_detection_confidence=0.7) as pose:
        results = pose.process(img_np)
        
        if not results.pose_landmarks:
            return "No person detected", "Please upload a clear image with your full body visible."
        
        # Get landmark coordinates
        lm = results.pose_landmarks.landmark
        
        # Select analysis based on exercise type
        if exercise_type == ExerciseType.SQUAT:
            return analyze_squat(lm)
        elif exercise_type == ExerciseType.PUSHUP:
            return analyze_pushup(lm)
        elif exercise_type == ExerciseType.PLANK:
            return analyze_plank(lm)
        elif exercise_type == ExerciseType.LUNGE:
            return analyze_lunge(lm)
        else:
            return analyze_general_posture(lm)

def analyze_squat(lm):
    """Analyze squat posture."""
    # Get relevant landmarks
    left_hip = get_landmark_coords(lm, mp_pose.PoseLandmark.LEFT_HIP.value)
    left_knee = get_landmark_coords(lm, mp_pose.PoseLandmark.LEFT_KNEE.value)
    left_ankle = get_landmark_coords(lm, mp_pose.PoseLandmark.LEFT_ANKLE.value)
    right_hip = get_landmark_coords(lm, mp_pose.PoseLandmark.RIGHT_HIP.value)
    right_knee = get_landmark_coords(lm, mp_pose.PoseLandmark.RIGHT_KNEE.value)
    right_ankle = get_landmark_coords(lm, mp_pose.PoseLandmark.RIGHT_ANKLE.value)
    left_shoulder = get_landmark_coords(lm, mp_pose.PoseLandmark.LEFT_SHOULDER.value)
    right_shoulder = get_landmark_coords(lm, mp_pose.PoseLandmark.RIGHT_SHOULDER.value)
    
    # Calculate angles
    left_knee_angle = get_angle(left_hip, left_knee, left_ankle)
    right_knee_angle = get_angle(right_hip, right_knee, right_ankle)
    hip_knee_distance = abs(left_knee[0] - right_knee[0])
    
    feedback = []
    result = "correct"
    
    # Check knee angle (proper squat depth)
    avg_knee_angle = (left_knee_angle + right_knee_angle) / 2
    if avg_knee_angle > 120:  # Not deep enough
        feedback.append("Try to squat deeper - aim for parallel thighs to the ground")
        result = "incorrect"
    elif avg_knee_angle < 70:  # Too deep
        feedback.append("You're squatting too deep, which may strain your knees")
        result = "incorrect"
        
    # Check knee alignment (knees should be in line with feet)
    if hip_knee_distance > 0.2:  # Knees caving in
        feedback.append("Keep your knees in line with your toes - avoid letting them cave inward")
        result = "incorrect"
    
    # Check back position
    back_vector = left_shoulder - left_hip
    vertical_vector = np.array([0, -1, 0])  # Upward direction
    back_angle = np.degrees(np.arccos(np.dot(back_vector, vertical_vector) / 
                                    (np.linalg.norm(back_vector) * np.linalg.norm(vertical_vector))))
    if back_angle > 45:  # Back leaning too far forward
        feedback.append("Keep your chest up and back straighter")
        result = "incorrect"
    
    if not feedback:
        feedback.append("Great squat form! Good depth and alignment.")
        
    return result, ". ".join(feedback)

def analyze_pushup(lm):
    """Analyze pushup posture."""
    # Get relevant landmarks
    left_shoulder = get_landmark_coords(lm, mp_pose.PoseLandmark.LEFT_SHOULDER.value)
    left_elbow = get_landmark_coords(lm, mp_pose.PoseLandmark.LEFT_ELBOW.value)
    left_wrist = get_landmark_coords(lm, mp_pose.PoseLandmark.LEFT_WRIST.value)
    right_shoulder = get_landmark_coords(lm, mp_pose.PoseLandmark.RIGHT_SHOULDER.value)
    right_elbow = get_landmark_coords(lm, mp_pose.PoseLandmark.RIGHT_ELBOW.value)
    right_wrist = get_landmark_coords(lm, mp_pose.PoseLandmark.RIGHT_WRIST.value)
    left_hip = get_landmark_coords(lm, mp_pose.PoseLandmark.LEFT_HIP.value)
    right_hip = get_landmark_coords(lm, mp_pose.PoseLandmark.RIGHT_HIP.value)
    left_ankle = get_landmark_coords(lm, mp_pose.PoseLandmark.LEFT_ANKLE.value)
    right_ankle = get_landmark_coords(lm, mp_pose.PoseLandmark.RIGHT_ANKLE.value)
    
    # Calculate angles and alignments
    left_elbow_angle = get_angle(left_shoulder, left_elbow, left_wrist)
    right_elbow_angle = get_angle(right_shoulder, right_elbow, right_wrist)
    
    # Check back alignment (should be straight)
    hip_center = (left_hip + right_hip) / 2
    shoulder_center = (left_shoulder + right_shoulder) / 2
    ankle_center = (left_ankle + right_ankle) / 2
    
    # Vector from hip to shoulder and hip to ankle
    hip_to_shoulder = shoulder_center - hip_center
    hip_to_ankle = ankle_center - hip_center
    
    # Calculate alignment angle (should be close to 180 degrees for straight back)
    alignment_angle = get_angle(shoulder_center, hip_center, ankle_center)
    
    feedback = []
    result = "correct"
    
    # Check elbow angle (depth of pushup)
    avg_elbow_angle = (left_elbow_angle + right_elbow_angle) / 2
    if avg_elbow_angle > 120:  # Not bending enough
        feedback.append("Try to lower your body more - aim for elbows at 90 degrees")
        result = "incorrect"
    
    # Check back alignment
    if not (170 < alignment_angle < 190):  # Not straight enough
        feedback.append("Keep your back straight - avoid sagging or lifting your hips")
        result = "incorrect"
    
    if not feedback:
        feedback.append("Great pushup form! Good depth and straight body alignment.")
        
    return result, ". ".join(feedback)

def analyze_plank(lm):
    """Analyze plank posture."""
    # Get relevant landmarks
    left_shoulder = get_landmark_coords(lm, mp_pose.PoseLandmark.LEFT_SHOULDER.value)
    right_shoulder = get_landmark_coords(lm, mp_pose.PoseLandmark.RIGHT_SHOULDER.value)
    left_hip = get_landmark_coords(lm, mp_pose.PoseLandmark.LEFT_HIP.value)
    right_hip = get_landmark_coords(lm, mp_pose.PoseLandmark.RIGHT_HIP.value)
    left_ankle = get_landmark_coords(lm, mp_pose.PoseLandmark.LEFT_ANKLE.value)
    right_ankle = get_landmark_coords(lm, mp_pose.PoseLandmark.RIGHT_ANKLE.value)
    
    # Calculate body alignment
    shoulder_center = (left_shoulder + right_shoulder) / 2
    hip_center = (left_hip + right_hip) / 2
    ankle_center = (left_ankle + right_ankle) / 2
    
    # Calculate angles for straight back
    alignment_angle = get_angle(shoulder_center, hip_center, ankle_center)
    
    # Check hip position (should not be too high or too low)
    hip_height = hip_center[1]
    shoulder_height = shoulder_center[1]
    hip_shoulder_height_diff = abs(hip_height - shoulder_height)
    
    feedback = []
    result = "correct"
    
    # Check back alignment
    if not (170 < alignment_angle < 190):
        feedback.append("Keep your body in a straight line from head to heels")
        result = "incorrect"
    
    # Check hip position
    if hip_height > shoulder_height + 0.05:  # Hips too high
        feedback.append("Lower your hips - they're too high")
        result = "incorrect"
    elif hip_height < shoulder_height - 0.05:  # Hips too low
        feedback.append("Raise your hips - they're sagging too low")
        result = "incorrect"
    
    if not feedback:
        feedback.append("Excellent plank! Your body is in perfect alignment.")
        
    return result, ". ".join(feedback)

def analyze_lunge(lm):
    """Analyze lunge posture."""
    # Get relevant landmarks
    left_hip = get_landmark_coords(lm, mp_pose.PoseLandmark.LEFT_HIP.value)
    left_knee = get_landmark_coords(lm, mp_pose.PoseLandmark.LEFT_KNEE.value)
    left_ankle = get_landmark_coords(lm, mp_pose.PoseLandmark.LEFT_ANKLE.value)
    right_hip = get_landmark_coords(lm, mp_pose.PoseLandmark.RIGHT_HIP.value)
    right_knee = get_landmark_coords(lm, mp_pose.PoseLandmark.RIGHT_KNEE.value)
    right_ankle = get_landmark_coords(lm, mp_pose.PoseLandmark.RIGHT_ANKLE.value)
    
    # Calculate knee angles
    left_knee_angle = get_angle(left_hip, left_knee, left_ankle)
    right_knee_angle = get_angle(right_hip, right_knee, right_ankle)
    
    # Determine which leg is forward based on z position
    if left_knee[2] < right_knee[2]:  # Left knee is forward
        front_knee_angle = left_knee_angle
        back_knee_angle = right_knee_angle
    else:  # Right knee is forward
        front_knee_angle = right_knee_angle
        back_knee_angle = left_knee_angle
    
    feedback = []
    result = "correct"
    
    # Check front knee angle (should be around 90 degrees)
    if front_knee_angle < 80 or front_knee_angle > 100:
        feedback.append("Adjust your front knee to a 90-degree angle")
        result = "incorrect"
    
    # Check back knee angle (should be around 90 degrees too)
    if back_knee_angle < 80 or back_knee_angle > 100:
        feedback.append("Adjust your back knee to a 90-degree angle")
        result = "incorrect"
    
    # Check vertical alignment of front knee (should be above ankle, not forward)
    # This would require more complex analysis in 3D space
    
    if not feedback:
        feedback.append("Great lunge form! Front and back legs are properly positioned.")
        
    return result, ". ".join(feedback)

def analyze_general_posture(lm):
    """Analyze general posture (back straightness, shoulder alignment)."""
    # Check back straightness
    left_shoulder = get_landmark_coords(lm, mp_pose.PoseLandmark.LEFT_SHOULDER.value)
    left_hip = get_landmark_coords(lm, mp_pose.PoseLandmark.LEFT_HIP.value)
    left_knee = get_landmark_coords(lm, mp_pose.PoseLandmark.LEFT_KNEE.value)
    
    # Check shoulder alignment
    right_shoulder = get_landmark_coords(lm, mp_pose.PoseLandmark.RIGHT_SHOULDER.value)
    shoulder_alignment = abs(left_shoulder[1] - right_shoulder[1])
    
    back_angle = get_angle(left_shoulder, left_hip, left_knee)
    feedback = []
    result = "correct"
    
    if not (160 < back_angle < 200):
        feedback.append("Your back is not straight. Try to maintain a neutral spine position.")
        result = "incorrect"
    
    if shoulder_alignment > 0.05:  # Threshold for uneven shoulders
        feedback.append("Your shoulders are not level. Try to keep them even.")
        result = "incorrect"
    
    if result == "correct":
        feedback.append("Great posture! Your back is straight and shoulders are aligned.")
    
    return result, ". ".join(feedback)

@app.post("/analyze-posture")
async def analyze_posture(
    file: UploadFile = File(...),
    exercise_type: ExerciseType = Query(ExerciseType.GENERAL, description="Type of exercise being performed")
):
    image_bytes = await file.read()
    result, tips = analyze_image_posture(image_bytes, exercise_type)
    
    # Return the analysis result
    return JSONResponse({
        "result": result,
        "tips": tips,
        "exercise_type": exercise_type
    })

@app.get("/available-exercises")
async def get_available_exercises():
    """Return a list of available exercise types for analysis."""
    return JSONResponse({
        "exercises": [e.value for e in ExerciseType]
    })

@app.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy"}

@app.get("/workout-routines")
async def workout_routines_endpoint():
    """Return available workout routines and suggestions."""
    data = get_workout_data()
    return JSONResponse(data)

@app.post("/save-workout")
async def save_workout_endpoint(workout_data: Dict = Body(...)):
    """Save a user's workout data."""
    try:
        result = save_workout(workout_data)
        return JSONResponse(result)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to save workout: {str(e)}"}
        )

@app.get("/user-progress/{user_id}")
async def user_progress_endpoint(user_id: str = "default"):
    """Get a user's workout progress."""
    try:
        data = get_user_progress(user_id)
        return JSONResponse(data)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to get user progress: {str(e)}"}
        )

@app.post("/analyze-nutrition")
async def nutrition_analysis_endpoint(file: UploadFile = File(...)):
    """Analyze food image for nutritional information."""
    try:
        image_bytes = await file.read()
        result = analyze_nutrition(image_bytes)
        return JSONResponse(result)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to analyze image: {str(e)}"}
        )

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/posture-analysis/{exercise_type}")
async def websocket_endpoint(websocket: WebSocket, exercise_type: str):
    await manager.connect(websocket)
    try:
        # Validate the exercise type
        try:
            selected_exercise = ExerciseType(exercise_type)
        except ValueError:
            selected_exercise = ExerciseType.GENERAL
        
        while True:
            # Receive the base64 image from client
            data = await websocket.receive_text()
            
            # Process base64 data
            if "data:image/jpeg;base64," in data:
                # Extract the base64 part
                base64_data = re.sub('^data:image/jpeg;base64,', '', data)
                image_bytes = base64.b64decode(base64_data)
                
                # Analyze posture
                result, tips = analyze_image_posture(image_bytes, selected_exercise)
                
                # Send results back
                await websocket.send_json({
                    "result": result,
                    "tips": tips,
                    "exercise_type": selected_exercise
                })
            else:
                await websocket.send_text("Invalid image data")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
        manager.disconnect(websocket)

# Achievement and social features
@app.get("/achievements/{user_id}")
async def get_user_achievements(user_id: str):
    achievements = [
        {"id": 1, "title": "First Workout", "description": "Complete your first workout", "unlocked": True, "date": "2024-01-15"},
        {"id": 2, "title": "Week Warrior", "description": "Complete 7 workouts in a week", "unlocked": True, "date": "2024-01-22"},
        {"id": 3, "title": "Month Master", "description": "Complete 30 workouts in a month", "unlocked": False, "date": None},
        {"id": 4, "title": "Nutrition Ninja", "description": "Log 50 meals", "unlocked": True, "date": "2024-02-01"},
        {"id": 5, "title": "Streak Superstar", "description": "Maintain a 30-day workout streak", "unlocked": False, "date": None}
    ]
    return {"achievements": achievements, "total_unlocked": len([a for a in achievements if a["unlocked"]])}

@app.get("/workout-recommendations/{user_id}")
async def get_workout_recommendations(user_id: str):
    recommendations = [
        {
            "id": 1,
            "title": "Morning Energy Boost",
            "duration": "20 min",
            "exercises": 8,
            "difficulty": "beginner",
            "category": "Cardio",
            "description": "Perfect for starting your day with energy"
        },
        {
            "id": 2,
            "title": "Strength Builder",
            "duration": "35 min",
            "exercises": 12,  
            "difficulty": "intermediate",
            "category": "Strength",
            "description": "Build muscle and increase strength"
        },
        {
            "id": 3,
            "title": "HIIT Challenge",
            "duration": "25 min",
            "exercises": 10,
            "difficulty": "advanced", 
            "category": "HIIT",
            "description": "High-intensity interval training"
        }
    ]
    return {"recommendations": recommendations}

@app.post("/social/share-progress")
async def share_progress(data: dict = Body(...)):
    return {
        "success": True,
        "message": "Progress shared successfully!",
        "share_url": f"https://fitpulse.app/progress/{data.get('user_id', 'demo')}",
        "engagement": {
            "likes": 15,
            "comments": 3,
            "shares": 2
        }
    }

@app.get("/stats/dashboard/{user_id}")
async def get_dashboard_stats(user_id: str):
    return {
        "weekly_summary": {
            "workouts_completed": 5,
            "calories_burned": 2400,
            "active_minutes": 180,
            "streak_days": 7
        },
        "monthly_goals": {
            "workout_goal": 20,
            "workouts_completed": 15,
            "nutrition_goal": 25,
            "meals_logged": 18
        },
        "recent_activities": [
            {"type": "workout", "name": "Morning Cardio", "date": "2024-09-24", "duration": 30},
            {"type": "meal", "name": "Protein Smoothie", "date": "2024-09-24", "calories": 280},
            {"type": "achievement", "name": "Week Warrior", "date": "2024-09-23", "points": 100}
        ]
    }

if __name__ == "__main__":
    # Start the FastAPI app with Uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
