import { NavLink, useNavigate } from "react-router-dom";
import { Dumbbell, BarChart3, Camera, Home, Apple, User, LogIn, LogOut, ChefHat, CalendarCheck, Menu, Moon, Sun } from "lucide-react";
import { useAuthStore } from "../lib/auth";
import { useThemeStore } from "../lib/theme";
import { Button } from "./ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useState } from "react";

const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const closeSheet = () => setIsOpen(false);

  return (
    <nav className="nav-brutal sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-fitness-green" />
            <span className="text-xl font-bold text-white">FitPulse</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  isActive
                    ? "bg-fitness-green text-white shadow-brutal"
                    : "text-white hover:bg-white hover:text-fitness-navy"
                }`
              }
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </NavLink>
            <NavLink
              to="/log-workout"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  isActive
                    ? "bg-fitness-green text-white shadow-brutal"
                    : "text-white hover:bg-white hover:text-fitness-navy"
                }`
              }
            >
              <Dumbbell className="h-4 w-4" />
              <span>Log Workout</span>
            </NavLink>
            <NavLink
              to="/progress"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  isActive
                    ? "bg-fitness-green text-white shadow-brutal"
                    : "text-white hover:bg-white hover:text-fitness-navy"
                }`
              }
            >
              <BarChart3 className="h-4 w-4" />
              <span>Progress & Community</span>
            </NavLink>
            <NavLink
              to="/posture-check"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  isActive
                    ? "bg-fitness-green text-white shadow-brutal"
                    : "text-white hover:bg-white hover:text-fitness-navy"
                }`
              }
            >
              <Camera className="h-4 w-4" />
              <span>Posture Check</span>
            </NavLink>
            <NavLink
              to="/nutrition"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  isActive
                    ? "bg-fitness-green text-white shadow-brutal"
                    : "text-white hover:bg-white hover:text-fitness-navy"
                }`
              }
            >
              <Apple className="h-4 w-4" />
              <span>Nutrition</span>
            </NavLink>
            
            <NavLink
              to="/nutrition-tracker"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  isActive
                    ? "bg-fitness-green text-white shadow-brutal"
                    : "text-white hover:bg-white hover:text-fitness-navy"
                }`
              }
            >
              <CalendarCheck className="h-4 w-4" />
              <span>Tracker</span>
            </NavLink>
            
            <NavLink
              to="/recipes"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  isActive
                    ? "bg-fitness-green text-white shadow-brutal"
                    : "text-white hover:bg-white hover:text-fitness-navy"
                }`
              }
            >
              <ChefHat className="h-4 w-4" />
              <span>Recipes</span>
            </NavLink>
          </div>

          {/* Theme toggle and user menu */}
          <div className="hidden lg:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-white hover:bg-white/10"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <NavLink
                  to="/login"
                  className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-white hover:bg-white hover:text-fitness-navy"
                >
                  <LogIn className="h-4 w-4 inline mr-2" />
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 bg-fitness-green text-white hover:bg-green-600"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <Dumbbell className="h-6 w-6 text-fitness-green" />
                    <span>FitPulse</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-3">
                  <NavLink
                    to="/"
                    onClick={closeSheet}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-fitness-green text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </NavLink>
                  
                  <NavLink
                    to="/log-workout"
                    onClick={closeSheet}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-fitness-green text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <Dumbbell className="h-5 w-5" />
                    <span>Log Workout</span>
                  </NavLink>
                  
                  <NavLink
                    to="/progress"
                    onClick={closeSheet}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-fitness-green text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span>Progress</span>
                  </NavLink>
                  
                  <NavLink
                    to="/posture-check"
                    onClick={closeSheet}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-fitness-green text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <Camera className="h-5 w-5" />
                    <span>Posture Check</span>
                  </NavLink>
                  
                  <NavLink
                    to="/nutrition"
                    onClick={closeSheet}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-fitness-green text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <Apple className="h-5 w-5" />
                    <span>Nutrition</span>
                  </NavLink>
                  
                  <NavLink
                    to="/nutrition-tracker"
                    onClick={closeSheet}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-fitness-green text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <CalendarCheck className="h-5 w-5" />
                    <span>Nutrition Tracker</span>
                  </NavLink>
                  
                  <NavLink
                    to="/recipes"
                    onClick={closeSheet}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-fitness-green text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <ChefHat className="h-5 w-5" />
                    <span>Recipes</span>
                  </NavLink>
                  
                  <div className="border-t pt-3 mt-3">
                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 mb-2"
                    >
                      {resolvedTheme === 'dark' ? (
                        <Sun className="h-5 w-5" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                      <span>{resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 text-sm text-gray-600">
                          Signed in as <strong>{user?.username}</strong>
                        </div>
                        <NavLink
                          to="/profile"
                          onClick={closeSheet}
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
                        >
                          <User className="h-5 w-5" />
                          <span>Profile</span>
                        </NavLink>
                        <button
                          onClick={() => {
                            handleLogout();
                            closeSheet();
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Log out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <NavLink
                          to="/login"
                          onClick={closeSheet}
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
                        >
                          <LogIn className="h-5 w-5" />
                          <span>Login</span>
                        </NavLink>
                        <NavLink
                          to="/register"
                          onClick={closeSheet}
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-fitness-green text-white hover:bg-green-600 transition-all duration-200"
                        >
                          <span>Sign Up</span>
                        </NavLink>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;