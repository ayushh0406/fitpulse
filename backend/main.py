from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import uvicorn

app = FastAPI()

@app.post("/analyze-posture")
async def analyze_posture(file: UploadFile = File(...)):
    # Placeholder: Save file and run posture analysis
    # You would use Mediapipe/OpenCV here
    # For now, just return a dummy response
    return JSONResponse({
        "result": "correct",  # or "incorrect"
        "tips": "Keep your back straight."
    })

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
