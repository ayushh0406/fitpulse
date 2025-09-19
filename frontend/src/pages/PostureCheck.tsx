import React, { useRef, useState, useEffect } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Exercise types matching the backend
type ExerciseType = "general" | "squat" | "pushup" | "plank" | "lunge";

const PostureCheck: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  
  const [exerciseType, setExerciseType] = useState<ExerciseType>("general");
  const [streaming, setStreaming] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [tips, setTips] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState<"correct" | "incorrect" | "">("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [availableExercises, setAvailableExercises] = useState<string[]>([]);
  
  // Fetch available exercises from backend
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await fetch("http://localhost:8000/available-exercises");
        const data = await res.json();
        if (data.exercises && Array.isArray(data.exercises)) {
          setAvailableExercises(data.exercises);
        }
      } catch (err) {
        console.error("Error fetching available exercises:", err);
        // Fallback to hardcoded list if API fails
        setAvailableExercises(["general", "squat", "pushup", "plank", "lunge"]);
      }
    };
    
    fetchExercises();
  }, []);

  // Clean up WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      stopCamera();
    };
  }, []);
  
  // Start webcam
  const startCamera = async () => {
    setFeedback("");
    setTips("");
    setFeedbackStatus("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        // Set canvas size to match video
        if (canvasRef.current) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
        }
        
        setStreaming(true);
      }
    } catch (err) {
      setFeedback("Could not access camera.");
      console.error("Camera error:", err);
    }
  };
  
  // Stop webcam
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setStreaming(false);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setConnectionStatus("disconnected");
    }
    
    setAnalyzing(false);
  };
  
  // Start/stop real-time analysis
  const toggleAnalysis = () => {
    if (analyzing) {
      // Stop analysis
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
        setConnectionStatus("disconnected");
      }
      setAnalyzing(false);
    } else {
      // Start analysis
      startWebSocketConnection();
      setAnalyzing(true);
    }
  };
  
  // Set up WebSocket connection
  const startWebSocketConnection = () => {
    if (!streaming) return;
    
    const ws = new WebSocket(`ws://localhost:8000/ws/posture-analysis/${exerciseType}`);
    wsRef.current = ws;
    
    ws.onopen = () => {
      console.log("WebSocket connection established");
      setConnectionStatus("connected");
      // Start sending frames
      requestAnimationFrame(sendFrame);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setFeedbackStatus(data.result);
        setTips(data.tips);
        
        if (data.result === "correct") {
          setFeedback("Correct Posture");
        } else {
          setFeedback("Incorrect Posture");
        }
      } catch (e) {
        console.error("Error parsing WebSocket message:", e);
      }
    };
    
    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setConnectionStatus("disconnected");
      setAnalyzing(false);
    };
    
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("error");
      setFeedback("Connection error. Please try again.");
      setAnalyzing(false);
    };
  };
  
  // Send video frame to backend via WebSocket
  const sendFrame = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !analyzing) return;
    
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Draw video frame to canvas
        ctx.drawImage(videoRef.current, 0, 0);
        
        // Convert canvas to JPEG data URL and send over WebSocket
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.7);
        wsRef.current.send(dataUrl);
        
        // Highlight posture status with color overlay
        if (feedbackStatus) {
          ctx.globalAlpha = 0.2;
          ctx.fillStyle = feedbackStatus === "correct" ? "green" : "red";
          ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.globalAlpha = 1.0;
        }
      }
    }
    
    // Continue sending frames if still analyzing
    if (analyzing) {
      requestAnimationFrame(sendFrame);
    }
  };
  
  // Handle exercise type change
  const handleExerciseChange = (value: string) => {
    setExerciseType(value as ExerciseType);
    // Restart analysis if already in progress
    if (analyzing && wsRef.current) {
      wsRef.current.close();
      setTimeout(() => {
        if (analyzing) {
          startWebSocketConnection();
        }
      }, 500);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Real-Time Exercise Posture Check</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative">
          {/* Main video display */}
          <div className="relative">
            <video 
              ref={videoRef} 
              width={640} 
              height={480} 
              autoPlay 
              muted 
              className="border-2 border-gray-300 rounded-md"
            />
            <canvas 
              ref={canvasRef} 
              width={640} 
              height={480} 
              className="absolute top-0 left-0 pointer-events-none"
            />
            
            {/* Status overlay */}
            {feedbackStatus && (
              <div className={`absolute top-2 right-2 px-3 py-1 rounded text-white ${
                feedbackStatus === "correct" ? "bg-green-600" : "bg-red-600"
              }`}>
                {feedbackStatus === "correct" ? "Correct" : "Incorrect"}
              </div>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap gap-4 mt-4">
            <button
              className={`px-4 py-2 text-white rounded ${streaming ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
              onClick={streaming ? stopCamera : startCamera}
            >
              {streaming ? "Stop Camera" : "Start Camera"}
            </button>
            
            <button
              className={`px-4 py-2 text-white rounded ${analyzing ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"}`}
              onClick={toggleAnalysis}
              disabled={!streaming || connectionStatus === "error"}
            >
              {analyzing ? "Stop Analysis" : "Start Real-time Analysis"}
            </button>
          </div>
        </div>
        
        <div className="flex-1 min-w-[300px]">
          {/* Exercise selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Select Exercise</h3>
            <Select value={exerciseType} onValueChange={handleExerciseChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select exercise type" />
              </SelectTrigger>
              <SelectContent>
                {availableExercises.map((exercise) => (
                  <SelectItem key={exercise} value={exercise}>
                    {exercise.charAt(0).toUpperCase() + exercise.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Feedback display */}
          <div className="border rounded-md p-4 bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Posture Feedback</h3>
            
            <div className="mb-4">
              <Badge variant={connectionStatus === "connected" ? "default" : "destructive"} className="mb-2">
                {connectionStatus === "connected" ? "Connected" : "Disconnected"}
              </Badge>
              
              {feedbackStatus && (
                <Badge variant={feedbackStatus === "correct" ? "success" : "destructive"} className="ml-2">
                  {feedbackStatus === "correct" ? "Correct Posture" : "Incorrect Posture"}
                </Badge>
              )}
            </div>
            
            {tips && (
              <div className="mt-2 text-sm">
                <strong>Tips:</strong> {tips}
              </div>
            )}
            
            {!streaming && (
              <p className="text-gray-500 italic">Start the camera to begin posture analysis</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostureCheck;
