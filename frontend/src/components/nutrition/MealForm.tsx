import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Meal } from '@/lib/nutrition';

interface MealFormProps {
  initialData?: Omit<Meal, 'id' | 'date'>;
  onSubmit: (meal: Omit<Meal, 'id' | 'date'>) => void;
  onCancel: () => void;
}

const MealForm: React.FC<MealFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Meal, 'id' | 'date'>>(
    initialData || {
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      mealType: 'breakfast',
    }
  );
  
  const handleChange = (field: keyof Omit<Meal, 'id' | 'date'>, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'name' || field === 'mealType' ? value : Number(value),
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Food</DialogTitle>
          <DialogDescription>
            Enter nutrition information for the food you consumed
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Food Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Chicken Breast"
              className="input-brutal"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mealType">Meal Type</Label>
            <Select
              value={formData.mealType}
              onValueChange={(value) => handleChange('mealType', value)}
            >
              <SelectTrigger className="input-brutal">
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                min="0"
                value={formData.calories}
                onChange={(e) => handleChange('calories', e.target.value)}
                placeholder="kcal"
                className="input-brutal"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                min="0"
                step="0.1"
                value={formData.protein}
                onChange={(e) => handleChange('protein', e.target.value)}
                placeholder="grams"
                className="input-brutal"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                min="0"
                step="0.1"
                value={formData.carbs}
                onChange={(e) => handleChange('carbs', e.target.value)}
                placeholder="grams"
                className="input-brutal"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                min="0"
                step="0.1"
                value={formData.fat}
                onChange={(e) => handleChange('fat', e.target.value)}
                placeholder="grams"
                className="input-brutal"
                required
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="btn-brutal-primary">
              Save Food
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MealForm;