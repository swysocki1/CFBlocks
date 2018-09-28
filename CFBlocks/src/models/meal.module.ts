export class Meal {
  id: string;
  name: string;
  type: string;
  contents: [Food];
  description: string;
}
export class Food {
  id: string;
  name: string;
  fat: number;
  carb: number;
  protein: number;
  serving: Serving = new Serving();
  image?: string;
}
export class Serving {
  amount: number;
  metric: string;
}
export function mergeFood(oldFood: Food, newFood: Food): Food {
  oldFood.name = isBlank(newFood.name) ? isBlank(newFood.name) : oldFood.name;
  oldFood.carb = newFood.carb && newFood.carb >= 0 ? newFood.carb : oldFood.carb;
  oldFood.fat = newFood.fat && newFood.fat >= 0 ? newFood.fat : oldFood.fat;
  oldFood.protein = newFood.protein && newFood.protein >= 0 ? newFood.protein : oldFood.protein;
  oldFood.serving = mergeServing(oldFood.serving, newFood.serving);
  return oldFood;
}
export function mergeServing(o: Serving, n: Serving): Serving {
  if (!(isBlank(n.metric) || n.amount <= 0)) {
    o.amount = n.amount;
    o.metric = n.metric;
  }
  return o;
}
export function isBlank(value: string): string {
  if (value && value.trim()) {
    return value.trim();
  }
  return '';
}
export class MealCalendar {
  id: string;
  date: Date;
  meals: [Meal];
}
export class BlockTemplate {
  metric: string;
  carbs: number;
  fats: number;
  protein: number;
}
