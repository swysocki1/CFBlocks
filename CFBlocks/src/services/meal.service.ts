import {Injectable} from '@angular/core';
import {Food, Meal, MealCalendar, MealFood} from '../models/meal.module';
import {LoginService} from './login.service';
import {HelperService} from './helper.service';
import * as moment from 'moment';
import {Observable} from 'rxjs/internal/Observable';

@Injectable()
export class MealService {
  constructor(private loginService: LoginService, private helper: HelperService) {}

  getMealCalendar(start: Date, end: Date): Observable<[MealCalendar]> {
    return new Observable<[MealCalendar]>(subscriber => {
      const user = this.loginService.getUser();

      // TODO query for user food
      const testData = this.getTestMealCalendar(start, end);

      subscriber.next(testData);
      subscriber.complete();
    });
  }

  getMealDisplay(meal: Meal): string {
    return meal.name;
    // const foodContents = this.getFoodContentsDisplay(meal.foods);
    // if (foodContents) {
    //   return `${meal.name} - ${this.getFoodContentsDisplay(meal.foods)}`;
    // } else {
    //   return meal.name;
    // }
  }
  getFoodContentsDisplay(foods: [MealFood]): string {
    const displayItems = [];
    foods.forEach(food => {
      displayItems.push(`${food.food.serving.amount} ${food.food.serving.metric} ${food.food.name}`);
    });
    if (displayItems.length > 0) {
      return displayItems.join(', ');
    } else {
      return '';
    }
  }
  isBreakFast(meal: Meal): boolean {
    return meal && meal.type && meal.type.toUpperCase() === 'BREAKFAST';
  }
  isLunch(meal: Meal): boolean {
    return meal && meal.type && meal.type.toUpperCase() === 'LUNCH';
  }
  isDinner(meal: Meal): boolean {
    return meal && meal.type && meal.type.toUpperCase() === 'DINNER';
  }
  isSnack(meal: Meal): boolean {
    return (meal && meal.type && meal.type.toUpperCase() === 'SNACK') || (!this.isBreakFast(meal) || !this.isLunch(meal) || !this.isDinner(meal));
  }
  private getTestMealCalendar(start: Date, end: Date): [MealCalendar] {
    const cal: [MealCalendar] = [] as [MealCalendar];
    for (let day = start; moment(day).isSameOrBefore(moment(end)); day = moment(day).add(1, 'days').toDate()) {
      const mc = new MealCalendar();
      mc.user = 'swysoc1@gmail,com';
      mc.date = this.helper.startOfDay(day);
      const meal1 = new Meal();
      meal1.name = 'Cheese Pizza';
      meal1.type = 'Breakfast';

      const cheese = new Food();
      cheese.serving.amount = 2;
      cheese.serving.metric = '1 Cup';
      cheese.protein = 8;
      cheese.carb = 3;
      cheese.fat = 8;
      cheese.name = 'Mozzarella';
      const cheeseMeal = new MealFood();
      cheeseMeal.food = cheese;
      cheeseMeal.servingAmount = 1;

      const dough = new Food();
      dough.serving.amount = 3;
      dough.serving.metric = '1 Cup';
      dough.protein = 10;
      dough.carb = 22;
      dough.fat = 6;
      dough.name = 'Pizza Dough';
      const doughMeal = new MealFood();
      doughMeal.food = cheese;
      doughMeal.servingAmount = 2;

      const sauce = new Food();
      sauce.serving.amount = 1;
      sauce.serving.metric = '6 Oz';
      sauce.protein = 0;
      sauce.carb = 8;
      sauce.fat = 2;
      sauce.name = 'Marinara Sauce';
      const sauceMeal = new MealFood();
      sauceMeal.food = cheese;
      sauceMeal.servingAmount = 1;

      meal1.foods = [] as [MealFood];
      meal1.foods.push(cheeseMeal, sauceMeal, doughMeal);
      mc.meals = [] as [Meal];
      mc.meals.push(meal1);
      cal.push(mc);
    }
    return cal;
  }
}
