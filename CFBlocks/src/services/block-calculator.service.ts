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
    if (food && food.food && food.food.serving) {
      return (food.servingAmount / food.food.serving.amount) * food.food.carb;
    } else {
      return 0;
    }
  }
  getFoodMealFats(food: MealFood) {
    if (food && food.food && food.food.serving) {
      return (food.servingAmount / food.food.serving.amount) * food.food.fat;
    } else {
      return 0;
    }
  }
  getFoodMealProtein(food: MealFood) {
      if (food && food.food && food.food.serving) {
        return (food.servingAmount / food.food.serving.amount) * food.food.protein;
      } else {
        return 0;
      }
  }
  calcCarbs(food: MealFood): number {
      if (food && food.food && food.food.serving) {
        return this.getFoodMealCarbs(food);
      } else {
        return 0;
      }
  }
  calcFats(food: MealFood): number {
    if (food && food.food && food.food.serving) {
      return this.getFoodMealFats(food);
    } else {
      return 0;
    }
  }
  calcProtein(food: MealFood): number {
    if (food && food.food && food.food.serving) {
      return this.getFoodMealProtein(food);
    } else {
      return 0;
    }
  }
  calcCalories(food: MealFood): number {
    if (food && food.food && food.food.serving) {
      return this.carbsToCals(this.calcCarbs(food)) + this.fatsToCals(this.calcFats(food)) + this.proteinToCals(this.calcProtein(food));
    } else {
      return 0;
    }
  }
  calcFoodCalories(food: Food): number {
    const mealFood = new MealFood();
    mealFood.food = food;
    mealFood.servingAmount = food.serving.amount;
    return this.calcCalories(mealFood);
  }
  getCarbs(blocks: number) { // TODO needs to reflect template
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
      if (user.blockTemplate.metric === 'Zone Block') {
        const blocks = this.getBlocks(user);
        let cals = 0;
        cals += this.carbsToCals(blocks * user.blockTemplate.carbs);
        cals += this.fatsToCals(blocks * user.blockTemplate.fats);
        cals += this.proteinToCals(blocks * user.blockTemplate.protein);
        return cals;
      } else if (user.blockTemplate.metric === 'Percentage') {
        let lbm = user.body.lbm.weight;
        if (user.body.lbm.metric.toLowerCase() === 'kilograms') {
          lbm = 2.2 * lbm;
        }
        const activityLevel = user.lifeStyle.activityLevel;
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
        const baseFigure = protein / 30;
        let cals = 0;
        cals += this.carbsToCals(baseFigure * user.blockTemplate.carbs);
        cals += this.fatsToCals(baseFigure * user.blockTemplate.fats);
        cals += this.proteinToCals(baseFigure * user.blockTemplate.protein);
        return cals;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }
  dailyCarbs(user: User) {
    if (user && user.username) {
      return this.dailyCals(user) / 100 * user.blockTemplate.carbs / 4;
    } else {
      return 0;
    }
  }
  dailyFats(user: User) {
    if (user && user.username) {
      return this.dailyCals(user) / 100 * user.blockTemplate.fats / 9;
    } else {
      return 0;
    }
  }
  dailyProtein(user: User) {
    if (user && user.username) {
      return (this.dailyCals(user) / 100 * user.blockTemplate.protein) / 7;
    } else {
      return 0;
    }
  }
}
