import React, { useState } from "react";
import { Upload, FileInput } from "lucide-react";

const NutritionAnalysis: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [nutritionData, setNutritionData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setNutritionData(null);
      setError("");
    }
  };

  const analyzeFoodImage = async () => {
    if (!image) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", image);

      const response = await fetch("http://localhost:8000/analyze-nutrition", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setNutritionData(data);
    } catch (err) {
      console.error("Error analyzing food:", err);
      setError("Failed to analyze food image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Food Nutrition Analysis</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Upload Food Image</h2>
            <p className="text-gray-600 mb-4">
              Take a photo of your meal or upload an existing image to get nutritional information.
            </p>
            
            <div className="flex items-center gap-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {imagePreview && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Preview</h2>
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Food preview" 
                  className="w-full h-auto max-h-64 object-contain border rounded-lg"
                />
              </div>
            </div>
          )}

          <button
            onClick={analyzeFoodImage}
            disabled={!image || loading}
            className={`w-full px-4 py-2 text-white rounded-md ${
              !image || loading ? "bg-gray-400" : "bg-fitness-green hover:bg-fitness-green-dark"
            }`}
          >
            {loading ? "Analyzing..." : "Analyze Food"}
          </button>

          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>

        <div className="flex-1">
          {nutritionData ? (
            <div className="border rounded-lg p-6 bg-white">
              <h2 className="text-xl font-semibold mb-4">Nutrition Information</h2>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium">{nutritionData.food_name}</h3>
                <p className="text-sm text-gray-500">{nutritionData.serving_size || "100g serving"}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-semibold">Calories:</span>
                  <span>{nutritionData.calories} kcal</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-semibold">Protein:</span>
                  <span>{nutritionData.protein}g</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-semibold">Carbohydrates:</span>
                  <span>{nutritionData.carbs}g</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-semibold">Fat:</span>
                  <span>{nutritionData.fat}g</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-semibold">Fiber:</span>
                  <span>{nutritionData.fiber}g</span>
                </div>
                
                <div className="flex justify-between py-2">
                  <span className="font-semibold">Sugar:</span>
                  <span>{nutritionData.sugar}g</span>
                </div>
              </div>
              
              {nutritionData.health_rating && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-semibold mb-2">Health Rating</h3>
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-6 h-6 rounded-full ${
                          i < nutritionData.health_rating ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm">{nutritionData.health_note}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="border rounded-lg p-6 bg-white h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FileInput className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Data Yet</h3>
                <p className="mt-2">Upload a food image and analyze to see nutrition information</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NutritionAnalysis;