import { NavLink } from "react-router-dom";
import { Dumbbell, BarChart3, Users, Home } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="nav-brutal sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-fitness-green" />
            <span className="text-xl font-bold text-white">FitPulse</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1">
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
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-fitness-green text-white"
                    : "text-white hover:bg-white hover:text-fitness-navy"
                }`
              }
            >
              <Home className="h-5 w-5" />
            </NavLink>
            <NavLink
              to="/log-workout"
              className={({ isActive }) =>
                `p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-fitness-green text-white"
                    : "text-white hover:bg-white hover:text-fitness-navy"
                }`
              }
            >
              <Dumbbell className="h-5 w-5" />
            </NavLink>
            <NavLink
              to="/progress"
              className={({ isActive }) =>
                `p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-fitness-green text-white"
                    : "text-white hover:bg-white hover:text-fitness-navy"
                }`
              }
            >
              <BarChart3 className="h-5 w-5" />
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;