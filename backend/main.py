
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import uvicorn
import mediapipe as mp
import numpy as np
from PIL import Image
import io

app = FastAPI()

mp_pose = mp.solutions.pose

def analyze_image_posture(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img_np = np.array(image)
    with mp_pose.Pose(static_image_mode=True) as pose:
        results = pose.process(img_np)
        if not results.pose_landmarks:
            return "No person detected", "Please upload a clear image of your exercise posture."
        # Example: check if back is straight (shoulder, hip, knee alignment)
        lm = results.pose_landmarks.landmark
        left_shoulder = lm[mp_pose.PoseLandmark.LEFT_SHOULDER]
        left_hip = lm[mp_pose.PoseLandmark.LEFT_HIP]
        left_knee = lm[mp_pose.PoseLandmark.LEFT_KNEE]
        # Simple angle check
        def get_angle(a, b, c):
            a = np.array([a.x, a.y])
            b = np.array([b.x, b.y])
            c = np.array([c.x, c.y])
            ba = a - b
            bc = c - b
            cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
            angle = np.arccos(cosine_angle)
            return np.degrees(angle)
        back_angle = get_angle(left_shoulder, left_hip, left_knee)
        if 160 < back_angle < 200:
            return "correct", "Great posture! Your back is straight."
        else:
            return "incorrect", "Try to keep your back straighter during the exercise."

@app.post("/analyze-posture")
async def analyze_posture(file: UploadFile = File(...)):
    image_bytes = await file.read()
    result, tips = analyze_image_posture(image_bytes)
    return JSONResponse({
        "result": result,
        "tips": tips
    })

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
