import {Injectable} from "@angular/core";
import {Food, MealFood} from '../models/meal.module';

@Injectable()
export class BlockCalculatorService {
  getBlocks(bmi: number, bodyWeight: number, activityLevel: string, goals: string): number {
    const lbm = (1 - (bmi / 100)) * bodyWeight;
    let protein = 0;
    if(activityLevel === 'Sitting Most of the Day') {
      protein = lbm * .65;
    } else if(activityLevel === 'Up and Down a Few Times a Day') {
      protein = lbm * .7;
    } else if(activityLevel === 'On Feet most of the Day') {
      protein = lbm * .8;
    } else if(activityLevel === 'Professional Athlete') {
      protein = lbm * .85;
    }
    let blocks = protein / 7;
    if(goals === 'Lose Weight') {
      blocks = blocks - 1;
    } else if(goals === 'Gain Mass' || goals === 'Athletic Performance') {
      blocks = blocks + 1;
    }
    return blocks;
  }
  calcCarbs(food: MealFood): number {
    return food.servingAmount / food.food.serving.amount * food.food.carb;
  }
  calcFats(food: MealFood): number {
    return food.servingAmount / food.food.serving.amount * food.food.fat;
  }
  calcProtein(food: MealFood): number {
    return food.servingAmount / food.food.serving.amount * food.food.protein;
  }
  calcCalories(food: MealFood): number {
    return this.calcCarbs(food) + this.calcFats(food) + this.calcProtein(food);
  }
  calcFoodCalories(food: Food, numberOfServings?: number): number {
    let result = 0;
    result += this.getCarbs(food.carb);
    result += this.getFats(food.fat);
    result += this.getProtein(food.protein);
    if (numberOfServings) {
      result = result * food.serving.amount;
    }
    return result;
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
}
