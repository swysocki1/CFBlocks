import {Injectable} from "@angular/core";
import {Food, MealFood} from '../models/meal.module';
import {User} from '../models/user.model';

@Injectable()
export class BlockCalculatorService {
  getBlocks(user: User): number {
    if (user && user.username) {
      let lbm = user.body.lbm.weight;
      if (user.body.lbm.metric.toLowerCase() === 'kilograms') {
        lbm = 2.2 * lbm;
      }
      const activityLevel = user.lifeStyle.activityLevel;
      const goals = user.lifeStyle.fitnessGoal;
      let protein = 0;
      if (activityLevel === 'Seated Most of the Day') {
        protein = lbm * .65;
      } else if (activityLevel === 'Regularly On/Off Feet Throughout the Day') {
        protein = lbm * .7;
      } else if (activityLevel === 'On Feet and Moving Consistently Moving All Day') {
        protein = lbm * .8;
      } else if (activityLevel === 'Professional Athlete') {
        protein = lbm * .85;
      }
      let blocks = protein / 7;
      if (goals === 'Lose Weight') {
        blocks = blocks - 1;
      } else if (goals === 'Gain Mass' || goals === 'Athletic Performance') {
        blocks = blocks + 1;
      }
      return blocks;
    } else {
      return 0;
    }
  }
  getFoodMealCarbs(food: MealFood) {
    return (food.servingAmount / food.food.serving.amount) * food.food.carb;
  }
  getFoodMealFats(food: MealFood) {
    return (food.servingAmount / food.food.serving.amount) * food.food.fat;
  }
  getFoodMealProtein(food: MealFood) {
    return (food.servingAmount / food.food.serving.amount) * food.food.protein;
  }
  calcCarbs(food: MealFood): number {
    return this.carbsToCals(this.getFoodMealCarbs(food));
  }
  calcFats(food: MealFood): number {
    return this.fatsToCals(this.getFoodMealFats(food));
  }
  calcProtein(food: MealFood): number {
    return this.proteinToCals(this.getFoodMealProtein(food));
  }
  calcCalories(food: MealFood): number {
    return this.calcCarbs(food) + this.calcFats(food) + this.calcProtein(food);
  }
  calcFoodCalories(food: Food): number {
    const mealFood = new MealFood();
    mealFood.food = food;
    mealFood.servingAmount = food.serving.amount;
    return this.calcCalories(mealFood);
  }
  getCarbs(blocks: number) {
    return blocks * 9;
  }
  getFats(blocks: number) {
    return blocks * 1.5;
  }
  getProtein(blocks: number) {
    return blocks * 7;
  }
  carbsToCals(carbs: number) {
    return carbs * 4;
  }
  fatsToCals(fats: number) {
    return fats * 9;
  }
  proteinToCals(protein: number) {
    return protein * 4;
  }
  dailyCals(user: User) {
    if (user && user.username) {
      let lbm = user.body.lbm.weight;
      if (user.body.lbm.metric.toLowerCase() === 'kilograms') {
        lbm = 2.2 * lbm;
      }
      const activityLevel = user.lifeStyle.activityLevel;
      const goals = user.lifeStyle.fitnessGoal;
      let protein = 0;
      if (activityLevel === 'Seated Most of the Day') {
        protein = lbm * .65;
      } else if (activityLevel === 'Regularly On/Off Feet Throughout the Day') {
        protein = lbm * .7;
      } else if (activityLevel === 'On Feet and Moving Consistently Moving All Day') {
        protein = lbm * .8;
      } else if (activityLevel === 'Professional Athlete') {
        protein = lbm * .85;
      }
      return protein / user.blockTemplate.protein * 100;
    } else {
      return 0;
    }
  }
  dailyCarbs(user: User) {
    if (user && user.username) {
      return this.dailyCals(user) / 100 * user.blockTemplate.carbs;
    } else {
      return 0;
    }
  }
  dailyFats(user: User) {
    if (user && user.username) {
      return this.dailyCals(user) / 100 * user.blockTemplate.fats;
    } else {
      return 0;
    }
  }
  dailyProtein(user: User) {
    if (user && user.username) {
      return this.dailyCals(user) / 100 * user.blockTemplate.protein;
    } else {
      return 0;
    }
  }
}
