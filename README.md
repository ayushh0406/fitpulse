FitPulse 💪
A Hevy-inspired workout tracker built for MumbAI Hack Day’s Vibe Code category, FitPulse is a frontend-only, multi-page React app designed to make fitness tracking lovable and engaging. With a neobrutalist UI (bold borders, vibrant green #10B981 accents, heavy shadows) and Lottie animations (dumbbell bounce, confetti, heart pulse), FitPulse solves the 70% gym app quit rate by offering quick workout logging, smart suggestions, progress tracking, and a mock community. Built with React Router, shdcn/ui, and Chart.js, it’s hyper-responsive (mobile, tablet, desktop) and opens with an instant fitness vibe that motivates busy folks to stay consistent.
Table of Contents

Overview
Problem & Solution
Features
Tech Stack
Installation
Usage
Folder Structure
Screenshots
Hackathon Appeal
Future Enhancements
Contributing
License

Overview
FitPulse is a frontend-only React app inspired by Hevy (https://www.hevyapp.com/), designed to keep users motivated with a neobrutalist UI (white #FFFFFF, black #000000, green #10B981) and lovable features like smart workout suggestions, a motivational streak counter, and personalized progress insights. Built in 4-6 hours using v0.dev, it’s a scalable MVP that tackles the high dropout rate of gym apps by making workout tracking fun, intuitive, and socially engaging.
Problem & Solution

Problem: 70% of gym app users quit within 30 days due to demotivating UX and complex interfaces (generic fitness stat).
Impact: Busy folks (students, professionals) struggle to stay consistent without quick, engaging tools.
Solution: FitPulse offers a Hevy-like experience with:
Fast workout logging with smart suggestions.
Visual progress tracking with personalized insights.
Mock community feed to boost motivation.
Lovable touches like motivational quotes, streak counters, and Lottie animations (confetti, fire, heart).



Features
FitPulse consists of three interconnected pages with lovable features:
1. Home Page

Use Case: Welcome and motivate users to start their fitness journey.
Components:
shdcn/ui Card: Headline (“Power Your Workouts with FitPulse”), 4.9/5 ratings bar (shdcn/ui Progress, green), random motivational quote (“Crush it, champ!”), mock “Download iOS”/“Download Android” buttons.
Streak Counter: shdcn/ui Card showing “X-day streak!” (mock 3 days, LocalStorage-based).
shdcn/ui NavBar: Links to Log Workout, Progress & Community (green highlight on active page).


Lottie Animations: Dumbbell bounce (100px, 1s loop) above headline; fire animation on streak counter (50px, 0.5s).
Responsive: Card full-width mobile, 600px desktop. Buttons full-width mobile, inline desktop (200px).

2. Log Workout Page

Use Case: Quick, fun workout logging with smart suggestions.
Components:
Input: shdcn/ui Form with Select (routines: “Chest Day”, “Legs”, “Full Body”), shdcn/ui Button (“Suggest Workout”, e.g., “Try Bench Press for Chest Day!”), Inputs for reps (1-50) and weight (0-300kg), shdcn/ui Buttons (“Add Set”, “Save Workout” to LocalStorage).
Output: shdcn/ui Card list of logged sets (e.g., “Bench Press: 10 reps, 50kg”), motivational quote on save (“You’re a beast!”).


Lottie Animations: Barbell spin on “Add Set” (100px, 0.5s); confetti burst on “Save Workout” (200px, 1s).
Responsive: Form stacks vertically mobile (100% width, 48px height), side-by-side desktop (50% width). Cards full-width mobile, 2-column grid desktop.

3. Progress & Community Page

Use Case: Track gains and feel connected.
Components:
shdcn/ui Card with Chart.js line chart (weight progress, mock 5 sessions, green line, 300px height desktop, 200px mobile).
shdcn/ui Card for progress insight (e.g., “You lifted 50kg more this week!”).
shdcn/ui Card for mock community feed: 3 items (“Friend A logged 100kg bench”, “Friend B crushed Legs”, “Friend C shared routine”) with like/share buttons (copies text to clipboard).


Lottie Animations: Chart points pulse green (0.5s loop); heart bounce on like/share (50px, 0.3s); confetti on insight load (200px, 1s).
Responsive: Chart 100% width mobile, 80% desktop. Feed cards stack mobile, 2-column tablet, 3-column desktop.

Tech Stack

Frontend: React (v18), shdcn/ui (neobrutalist components), React Router (navigation).
Styling: Tailwind CSS, neobrutalism (white #FFFFFF, black #000000, green #10B981, bold 4px borders, heavy shadows 0 8px 16px rgba(0,0,0,0.3)).
Animations: Lottie (dumbbell bounce, fire, confetti, chart pulse, heart bounce, <50KB).
Charts: Chart.js (line chart for progress).
Storage: LocalStorage (workouts, streak).
Icons: shdcn/ui Icons (dumbbell, chart-bar, heart, 20px desktop, 16px mobile).
Tools: v0.dev (UI generation), vanilla JS (logic), Vercel (deploy).

Installation

Clone the repository:git clone https://github.com/your-username/fitpulse.git
cd fitpulse


Install dependencies:npm install


Install additional packages:npm install react-router-dom @shadcn/ui chart.js lottie-react


Run the app:npm start

Open http://localhost:3000 in your browser.

Usage

Home: View motivational headline, streak counter, and ratings. Navigate to other pages via NavBar.
Log Workout:
Select routine (e.g., “Chest Day”), click “Suggest Workout” for exercise ideas (e.g., “Bench Press”).
Input reps/weight, click “Add Set” to log, then “Save Workout” (triggers confetti and quote).


Progress & Community:
View weight progress chart and personalized insights (e.g., “50kg more this week!”).
Engage with mock community feed, like/share posts (copies text to clipboard).




Responsive: Works seamlessly on mobile (360px), tablet (768px), desktop (1200px).
Accessibility: ARIA labels, high contrast, keyboard-navigable.

Folder Structure
FitPulse/
├── src/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── LogWorkout.jsx
│   │   ├── ProgressCommunity.jsx
│   ├── components/
│   │   ├── NavBar.jsx
│   │   ├── WorkoutCard.jsx
│   │   ├── FeedCard.jsx
│   ├── assets/
│   │   ├── lottie/
│   │   │   ├── dumbbell.json
│   │   │   ├── barbell.json
│   │   │   ├── fire.json
│   │   │   ├── confetti.json
│   │   │   ├── heart.json
│   ├── App.jsx
│   ├── index.css (Tailwind)
├── public/
│   ├── index.html
├── README.md
├── package.json

Screenshots
(Add screenshots here post-deployment)  

Home: Motivational headline, streak counter, ratings bar.  
Log Workout: Form with suggestion button, set cards, confetti on save.  
Progress & Community: Chart, insights, mock feed with heart animations.

Hackathon Appeal

Impact: Solves 70% gym app quit rate with quick logging, smart suggestions, progress insights, and mock community—motivates like Hevy’s 8M+ users.
Lovable UX: Motivational quotes, streak counter, and Lottie animations (confetti, fire, heart) make fitness fun and addictive.
Neobrutalist Vibe: Bold borders, green accents, and heavy shadows scream modern and playful, aligning with Hevy’s premium feel.
Scalability: Frontend-only MVP, ready for backend (e.g., Firebase for real community).
Vibe Code Fit: Practical features, tagda UI, and 4-6 hour build time nail UX and presentation.

Future Enhancements

Add workout history page for past logs.
Integrate Firebase for real-time community feed and data storage.
Convert to React Native for iOS/Android apps.
Enhance suggestions with user input (e.g., fitness level, goals).

Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/new-feature).
Commit changes (git commit -m "Add new feature").
Push to the branch (git push origin feature/new-feature).
Open a Pull Request.

License
MIT LicenseBuilt with ❤️ for MumbAI Hack Day.
