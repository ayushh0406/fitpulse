# 💪 FitPulse  

**FitPulse** is a modern **fitness ## 🌟 Features  

### 1️⃣ Home Page  
- Hea### 3️⃣ Progress & Community Page  
- 📊 **Chart.js line graph** for weight progress  
- 💡 Personalized insights (*"50kg more this week!"*)  
- 👥 Mock community feed (like/share buttons)  
- ❤️ Heart animations + confetti on interactions  

---

### 4️⃣ Posture Check Page  
- 📹 **Real-time webcam posture analysis**
- 🔄 **WebSocket connection** for continuous feedback
- 🧘 **Multiple exercise types:** squat, pushup, plank, lunge, general
- 📊 **Visual feedback** with colored overlays for correct/incorrect form
- 💡 **Detailed form tips** based on posture analysis
- 🖼️ **Exercise selection UI** for targeted posture analysis: *"Power Your Workouts with FitPulse"*  
- ⭐ **4.9/5 ratings bar** (Progress component)  
- 🔥 **Streak counter** (LocalStorage)  
- 💬 Random motivational quotes  
- 🎨 Lottie animations: dumbbell bounce & fire effect  

---

### 2️⃣ Log Workout Page  
- Select routine: *Chest / Legs / Full Body*  
- Smart suggestions: *"Try Bench Press for Chest Day!"*  
- Add sets with reps + weights  
- Save workouts in LocalStorage  
- 🎉 Confetti & barbell animations on save  

---

### 4️⃣ Posture Check Page  
- 📹 **Real-time webcam posture analysis**
- 🔄 **WebSocket connection** for continuous feedback
- 🧘 **Multiple exercise types:** squat, pushup, plank, lunge, general
- 📊 **Visual feedback** with colored overlays for correct/incorrect form
- 💡 **Detailed form tips** based on posture analysis
- 🖼️ **Exercise selection UI** for targeted posture analysislt for **MumbAI Hack Day’s Vibe Code category**.  
It’s a **frontend-only React app** that makes workout tracking **fun, simple, and motivating** with a **neobrutalist UI** (bold borders, vibrant green `#10B981` accents, heavy shadows) and **Lottie animations** (dumbbell bounce, confetti, heart pulse).  



---

## 📑 Table of Contents  

- [Overview](#-overview)  
- [Problem & Solution](#-problem--solution)  
- [Features](#-features)  
- [Tech Stack](#-tech-stack)  
- [Installation](#-installation)  
- [Usage](#-usage)  
- [Folder Structure](#-folder-structure)  
- [Screenshots](#-screenshots)  
- [Hackathon Appeal](#-hackathon-appeal)  
- [Future Enhancements](#-future-enhancements)  
- [Contributing](#-contributing)  
- [License](#-license)  

---

## 🔎 Overview  

- ⚡ **Frontend-only MVP** built in **4-6 hours** using [v0.dev](https://v0.dev)  
- 🏋️ **Three pages:** Home, Log Workout, Progress & Community  
- 🎨 **Neobrutalist UI** with bold borders, heavy shadows, and vibrant accents  
- 🎉 **Lovable touches:** Motivational streaks, smart suggestions, Lottie animations  
- 📱 **Responsive:** Works on mobile, tablet, and desktop  

---

## ❌ Problem & ✅ Solution  

### Problem  
- 70% of gym app users quit within 30 days 📉  
- Reasons: **demotivating UX** + **complex interfaces**  
- Busy people need **quick, fun, and engaging tools** to stay consistent  

### Solution  
FitPulse provides:  
- ⚡ **Quick workout logging** with smart suggestions  
- 📊 **Progress tracking** with personalized insights  
- 👥 **Mock community feed** for motivation  
- 🎉 **Gamified UX** → streak counters, quotes, animations  
- 🎯 **Real-time posture detection** for proper exercise form

---

## 🌟 Features  

### 1️⃣ Home Page  
- Headline: *“Power Your Workouts with FitPulse”*  
- ⭐ **4.9/5 ratings bar** (Progress component)  
- 🔥 **Streak counter** (LocalStorage)  
- 💬 Random motivational quotes  
- 🎨 Lottie animations: dumbbell bounce & fire effect  

---

### 2️⃣ Log Workout Page  
- Select routine: *Chest / Legs / Full Body*  
- Smart suggestions: *“Try Bench Press for Chest Day!”*  
- Add sets with reps + weights  
- Save workouts in LocalStorage  
- 🎉 Confetti & barbell animations on save  

---

### 3️⃣ Progress & Community Page  
- 📊 **Chart.js line graph** for weight progress  
- 💡 Personalized insights (*“50kg more this week!”*)  
- 👥 Mock community feed (like/share buttons)  
- ❤️ Heart animations + confetti on interactions  

---

## 🛠️ Tech Stack  

- **Frontend:** React 18, TypeScript, Vite, React Router, shadcn/ui
- **Backend:** Python, FastAPI, WebSocket
- **Computer Vision:** MediaPipe Pose, OpenCV, PIL
- **Styling:** Tailwind CSS (Neobrutalist theme)  
- **Animations:** Lottie (confetti, heart, dumbbell, fire)  
- **Charts:** Chart.js  
- **Storage:** LocalStorage  
- **Deployment:** Vercel (frontend), Python server (backend)

---

## 🏋️ Posture Detection Implementation

### Backend (Python)

The posture detection feature uses **MediaPipe Pose** for skeletal tracking and analysis:

1. **MediaPipe Pose Model:**
   - Detects 33 body landmarks in 3D space
   - Each landmark provides x, y, z coordinates

2. **Exercise-Specific Analysis:**
   - Custom algorithms for different exercises (squats, pushups, etc.)
   - Angle calculations between key joints (e.g., knee angle for squats)
   - Alignment checking for proper form

3. **Real-time WebSocket Communication:**
   - Continuous frame processing with minimal latency
   - Immediate feedback sent to frontend

### Frontend (React)

The user interface provides an intuitive experience:

1. **Webcam Integration:**
   - Canvas overlay for visual feedback
   - Color coding for correct/incorrect posture

2. **Exercise Selection:**
   - Dropdown menu to choose specific exercises
   - Tailored analysis based on selection

3. **Feedback System:**
   - Real-time status badges
   - Detailed tips for improving form
   - Visual indicators on the video feed  

---

## ⚙️ Installation  

### Frontend

```bash
# Clone the repository
git clone https://github.com/your-username/fitpulse.git
cd fitpulse

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run frontend development server
npm run dev
```

### Backend

```bash
# In the root directory, navigate to the backend folder
cd backend

# Create a Python virtual environment (optional but recommended)
python -m venv venv

# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install required Python packages
pip install fastapi uvicorn python-multipart pillow numpy mediapipe

# Start the backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📱 Usage

1. **Start both servers:**
   - Frontend: http://localhost:5173/
   - Backend: http://localhost:8000/

2. **Navigate to the Posture Check page:**
   - Click on "Posture Check" in the navigation bar
   
3. **Using the Posture Analysis feature:**
   - Click "Start Camera" to enable your webcam
   - Select an exercise type (squat, pushup, plank, lunge, or general)
   - Click "Start Real-time Analysis" to begin posture detection
   - Perform the selected exercise in front of your camera
   - Observe real-time feedback with color overlays:
     - Green: Correct posture
     - Red: Incorrect posture
   - Read the detailed tips for improving your form

4. **API Documentation:**
   - FastAPI automatic documentation is available at http://localhost:8000/docs
   - Available endpoints:
     - POST `/analyze-posture`: For single frame analysis
     - WebSocket `/ws/posture-analysis/{exercise_type}`: For real-time analysis
     - GET `/available-exercises`: List supported exercise types
```
