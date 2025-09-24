import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { Badge } from "./badge";
import { X, Plus } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description: string;
  action: string;
  onAction: (data: any) => void;
  type: "workout" | "meal" | "note" | "goal";
}

export function QuickActionCard({ title, description, action, onAction, type }: QuickActionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAction(formData);
    setFormData({});
    setIsExpanded(false);
  };

  const renderForm = () => {
    switch (type) {
      case "workout":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="exercise">Exercise</Label>
              <Input
                id="exercise"
                placeholder="e.g., Push-ups"
                value={formData.exercise || ""}
                onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sets">Sets</Label>
                <Input
                  id="sets"
                  type="number"
                  placeholder="3"
                  value={formData.sets || ""}
                  onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="reps">Reps</Label>
                <Input
                  id="reps"
                  type="number"
                  placeholder="12"
                  value={formData.reps || ""}
                  onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                />
              </div>
            </div>
          </div>
        );
      case "meal":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="meal">Meal</Label>
              <Input
                id="meal"
                placeholder="e.g., Grilled Chicken Salad"
                value={formData.meal || ""}
                onChange={(e) => setFormData({ ...formData, meal: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="calories">Calories (optional)</Label>
              <Input
                id="calories"
                type="number"
                placeholder="450"
                value={formData.calories || ""}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              />
            </div>
          </div>
        );
      case "note":
        return (
          <div>
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              placeholder="How was your workout today?"
              value={formData.note || ""}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            />
          </div>
        );
      case "goal":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="goal">Goal</Label>
              <Input
                id="goal"
                placeholder="e.g., Lose 5kg in 2 months"
                value={formData.goal || ""}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="target">Target Date</Label>
              <Input
                id="target"
                type="date"
                value={formData.target || ""}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {isExpanded && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isExpanded ? (
          <Button
            onClick={() => setIsExpanded(true)}
            className="w-full"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            {action}
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {renderForm()}
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsExpanded(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}