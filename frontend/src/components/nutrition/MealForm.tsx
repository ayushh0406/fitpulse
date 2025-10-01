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
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateField = (field: keyof Omit<Meal, 'id' | 'date'>, value: string | number): string | null => {
    if (field === 'name' && (!value || (typeof value === 'string' && value.trim().length === 0))) {
      return 'Food name is required.';
    }
    if (['calories', 'protein', 'carbs', 'fat'].includes(field) && (Number(value) < 0 || isNaN(Number(value)))) {
      return 'Value must be a positive number.';
    }
    return null;
  };
  
  const handleInputChange = (field: keyof Omit<Meal, 'id' | 'date'>, value: string) => {
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error || '' }));
    
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'name' || field === 'mealType' ? value : Number(value) || 0,
    }));
  };
  
  const handleBlur = (field: keyof Omit<Meal, 'id' | 'date'>, value: string) => {
    const numValue = Number(value) || 0;
    const error = validateField(field, numValue);
    setErrors((prev) => ({ ...prev, [field]: error || '' }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      const field = key as keyof Omit<Meal, 'id' | 'date'>;
      const error = validateField(field, value);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
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
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Food Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g. Chicken Breast"
              className={`input-brutal transition-colors ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              required
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-red-500 px-2">
                {errors.name}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mealType">Meal Type</Label>
            <Select
              value={formData.mealType}
              onValueChange={(value) => handleInputChange('mealType', value)}
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
            {errors.mealType && (
              <p id="mealType-error" className="text-sm text-red-500 px-2">
                {errors.mealType}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                min="0"
                step="1"
                value={formData.calories}
                onChange={(e) => handleInputChange('calories', e.target.value)}
                onBlur={(e) => handleBlur('calories', e.target.value)}
                placeholder="kcal"
                className={`input-brutal transition-colors ${errors.calories ? 'border-red-500 focus:border-red-500' : ''}`}
                aria-invalid={!!errors.calories}
                aria-describedby={errors.calories ? 'calories-error' : undefined}
                required
              />
              {errors.calories && (
                <p id="calories-error" className="text-sm text-red-500 px-2">
                  {errors.calories}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                min="0"
                step="0.1"
                value={formData.protein}
                onChange={(e) => handleInputChange('protein', e.target.value)}
                onBlur={(e) => handleBlur('protein', e.target.value)}
                placeholder="grams"
                className={`input-brutal transition-colors ${errors.protein ? 'border-red-500 focus:border-red-500' : ''}`}
                aria-invalid={!!errors.protein}
                aria-describedby={errors.protein ? 'protein-error' : undefined}
                required
              />
              {errors.protein && (
                <p id="protein-error" className="text-sm text-red-500 px-2">
                  {errors.protein}
                </p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                min="0"
                step="0.1"
                value={formData.carbs}
                onChange={(e) => handleInputChange('carbs', e.target.value)}
                onBlur={(e) => handleBlur('carbs', e.target.value)}
                placeholder="grams"
                className={`input-brutal transition-colors ${errors.carbs ? 'border-red-500 focus:border-red-500' : ''}`}
                aria-invalid={!!errors.carbs}
                aria-describedby={errors.carbs ? 'carbs-error' : undefined}
                required
              />
              {errors.carbs && (
                <p id="carbs-error" className="text-sm text-red-500 px-2">
                  {errors.carbs}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                min="0"
                step="0.1"
                value={formData.fat}
                onChange={(e) => handleInputChange('fat', e.target.value)}
                onBlur={(e) => handleBlur('fat', e.target.value)}
                placeholder="grams"
                className={`input-brutal transition-colors ${errors.fat ? 'border-red-500 focus:border-red-500' : ''}`}
                aria-invalid={!!errors.fat}
                aria-describedby={errors.fat ? 'fat-error' : undefined}
                required
              />
              {errors.fat && (
                <p id="fat-error" className="text-sm text-red-500 px-2">
                  {errors.fat}
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="btn-brutal-primary" disabled={Object.keys(errors).length > 0}>
              Save Food
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MealForm;
