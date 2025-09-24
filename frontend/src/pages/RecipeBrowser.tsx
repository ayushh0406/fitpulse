import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNutritionStore, Recipe } from '@/lib/nutrition';
import { Search, Clock, Users, Tag } from "lucide-react";

const RecipeBrowser = () => {
  const { savedRecipes } = useNutritionStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(savedRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  // Extract all unique tags from recipes
  const allTags = Array.from(
    new Set(savedRecipes.flatMap((recipe) => recipe.tags))
  );
  
  // Filter recipes based on search query and selected tag
  useEffect(() => {
    let results = savedRecipes;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter((recipe) => 
        recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(query))
      );
    }
    
    if (selectedTag) {
      results = results.filter((recipe) => recipe.tags.includes(selectedTag));
    }
    
    setFilteredRecipes(results);
  }, [searchQuery, selectedTag, savedRecipes]);
  
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="heading-brutal text-3xl lg:text-4xl font-black mb-2 text-center">
          Healthy <span className="text-fitness-green">Recipes</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8 text-center">
          Discover nutritious and delicious meals to support your fitness goals
        </p>
        
        {/* Search & Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search recipes or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 input-brutal"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(null)}
            >
              All
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
        
        {selectedRecipe ? (
          <div className="space-y-6">
            <Button 
              variant="outline"
              onClick={() => setSelectedRecipe(null)}
            >
              Back to Recipes
            </Button>
            
            {/* Recipe Details */}
            <Card className="brutal-card overflow-hidden">
              {selectedRecipe.image && (
                <div className="h-64 overflow-hidden">
                  <img 
                    src={selectedRecipe.image} 
                    alt={selectedRecipe.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl">{selectedRecipe.name}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedRecipe.tags.map((tag) => (
                    <div 
                      key={tag} 
                      className="bg-muted px-2 py-1 rounded-md text-xs font-medium"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Nutrition Info */}
                <div className="bg-muted p-4 rounded-lg grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Calories</p>
                    <p className="font-bold">{selectedRecipe.calories}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Protein</p>
                    <p className="font-bold">{selectedRecipe.protein}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Carbs</p>
                    <p className="font-bold">{selectedRecipe.carbs}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fat</p>
                    <p className="font-bold">{selectedRecipe.fat}g</p>
                  </div>
                </div>
                
                {/* Recipe Info */}
                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{selectedRecipe.prepTime + selectedRecipe.cookTime} min</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{selectedRecipe.servings} servings</span>
                  </div>
                </div>
                
                {/* Ingredients */}
                <div className="space-y-2">
                  <h3 className="font-bold">Ingredients</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedRecipe.ingredients.map((ingredient, i) => (
                      <li key={i}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                
                {/* Instructions */}
                <div className="space-y-2">
                  <h3 className="font-bold">Instructions</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    {selectedRecipe.instructions.map((instruction, i) => (
                      <li key={i}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredRecipes.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No recipes found matching your criteria.</p>
                <Button 
                  className="mt-4"
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTag(null);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              filteredRecipes.map((recipe) => (
                <Card 
                  key={recipe.id} 
                  className="brutal-card overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <div className="h-36 overflow-hidden">
                    <img 
                      src={recipe.image || 'https://placehold.co/600x400/e2e8f0/a0aec0?text=No+Image'} 
                      alt={recipe.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold truncate">{recipe.name}</h3>
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{recipe.prepTime + recipe.cookTime} min</span>
                      </div>
                      <div className="flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        <span>{recipe.tags[0]}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeBrowser;