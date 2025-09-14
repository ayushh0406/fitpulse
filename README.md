# 💪 FitPulse  

**FitPulse** is a modern **fitness tracker app** built for **MumbAI Hack Day’s Vibe Code category**.  
It’s a **frontend-only React app** that makes workout tracking **fun, simple, and motivating** with a **neobrutalist UI** (bold borders, vibrant green `#10B981` accents, heavy shadows) and **Lottie animations** (dumbbell bounce, confetti, heart pulse).  

👉 Deployed Live: [FitPulse Demo](https://fitpulse-strong-vibes.lovable.app/)  
👉 GitHub Repo: [FitPulse on GitHub](https://github.com/your-username/fitpulse)  

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

- **Frontend:** React 18, React Router, shdcn/ui  
- **Styling:** Tailwind CSS (Neobrutalist theme)  
- **Animations:** Lottie (confetti, heart, dumbbell, fire)  
- **Charts:** Chart.js  
- **Storage:** LocalStorage  
- **Deployment:** Vercel  
- **Tools:** v0.dev  

---

## ⚙️ Installation  

```bash
# Clone the repository
git clone https://github.com/your-username/fitpulse.git
cd fitpulse

# Install dependencies
npm install

# Install extra packages
npm install react-router-dom @shadcn/ui chart.js lottie-react

# Run locally
npm start
