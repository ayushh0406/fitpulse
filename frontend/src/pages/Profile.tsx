import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore, User, UserPreferences } from "@/lib/auth";
import { Edit, Save, User as UserIcon } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, isAuthenticated, updateProfile, updatePreferences, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<Partial<User>>({});
  const [preferencesData, setPreferencesData] = useState<Partial<UserPreferences>>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user) {
      setProfileData({
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      });
      
      setPreferencesData(user.preferences || {
        darkMode: false,
        notificationsEnabled: true,
        measurementUnit: 'metric',
        fitnessGoal: 'general-fitness',
      });
    }
  }, [user, isAuthenticated, navigate]);
  
  const handleSaveProfile = async () => {
    try {
      if (profileData) {
        await updateProfile(profileData);
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };
  
  const handleSavePreferences = async () => {
    try {
      if (preferencesData) {
        await updatePreferences(preferencesData);
      }
      
      toast({
        title: "Preferences Updated",
        description: "Your preferences have been successfully updated",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update preferences",
        variant: "destructive",
      });
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="heading-brutal text-3xl lg:text-4xl font-black mb-8 text-center">
          Your <span className="text-fitness-green">Profile</span>
        </h1>
        
        <div className="grid gap-8">
          {/* Profile Header */}
          <Card className="brutal-card">
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-fitness-green">
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback className="bg-fitness-green text-white text-2xl">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm" className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold">{user.username}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex gap-3 mt-4 md:mt-0">
                <Button 
                  variant={isEditing ? "outline" : "default"}
                  className={isEditing ? "border-fitness-green text-fitness-green" : ""}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Profile Tabs */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="details">Profile Details</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            {/* Profile Details Tab */}
            <TabsContent value="details">
              <Card className="brutal-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserIcon className="h-5 w-5 mr-2 text-fitness-green" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Username</Label>
                      {isEditing ? (
                        <Input 
                          value={profileData.username || ''} 
                          onChange={(e) => setProfileData({...profileData, username: e.target.value})} 
                          className="input-brutal"
                        />
                      ) : (
                        <div className="p-2 bg-muted rounded-md">{user.username}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Email</Label>
                      {isEditing ? (
                        <Input 
                          type="email" 
                          value={profileData.email || ''} 
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})} 
                          className="input-brutal"
                        />
                      ) : (
                        <div className="p-2 bg-muted rounded-md">{user.email}</div>
                      )}
                    </div>
                    
                    {isEditing && (
                      <Button 
                        onClick={handleSaveProfile} 
                        className="btn-brutal-primary w-full"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card className="brutal-card">
                <CardHeader>
                  <CardTitle>User Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Measurement Unit</Label>
                      <Select
                        value={preferencesData.measurementUnit || 'metric'}
                        onValueChange={(value) => setPreferencesData({
                          ...preferencesData, 
                          measurementUnit: value as 'metric' | 'imperial'
                        })}
                      >
                        <SelectTrigger className="input-brutal">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                          <SelectItem value="imperial">Imperial (lb, in)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Fitness Goal</Label>
                      <Select
                        value={preferencesData.fitnessGoal || 'general-fitness'}
                        onValueChange={(value) => setPreferencesData({
                          ...preferencesData, 
                          fitnessGoal: value as 'weight-loss' | 'muscle-gain' | 'maintenance' | 'general-fitness'
                        })}
                      >
                        <SelectTrigger className="input-brutal">
                          <SelectValue placeholder="Select goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weight-loss">Weight Loss</SelectItem>
                          <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="general-fitness">General Fitness</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      onClick={handleSavePreferences} 
                      className="btn-brutal-primary mt-4"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Progress Summary Card */}
          <Card className="brutal-card">
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted p-4 rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Workouts</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <div className="bg-muted p-4 rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Streak</p>
                  <p className="text-2xl font-bold">3 days</p>
                </div>
                <div className="bg-muted p-4 rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Total Sets</p>
                  <p className="text-2xl font-bold">142</p>
                </div>
                <div className="bg-muted p-4 rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Avg. Per Week</p>
                  <p className="text-2xl font-bold">3.5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;