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
  serving: string;
  servings: number;
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
