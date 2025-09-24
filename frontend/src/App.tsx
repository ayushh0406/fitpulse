import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PostureCheck from "./pages/PostureCheck";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import LogWorkout from "./pages/LogWorkout";
import Progress from "./pages/Progress";
import NotFound from "./pages/NotFound";
import NutritionAnalysis from "./pages/NutritionAnalysis";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NutritionTracker from "./pages/NutritionTracker";
import RecipeBrowser from "./pages/RecipeBrowser";
import { useAuthStore } from "./lib/auth";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/log-workout" element={<LogWorkout />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/posture-check" element={<PostureCheck />} />
            <Route path="/nutrition" element={<NutritionAnalysis />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Nutrition Routes */}
            <Route path="/nutrition-tracker" element={<NutritionTracker />} />
            <Route path="/recipes" element={<RecipeBrowser />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
