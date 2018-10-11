import {Meal} from '../../models/meal.module';
import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {ValidationService} from '../../services/validation.service';
import {FoodFilterPipe} from './foodFilter.pipe';

@Pipe({
  name: 'mealSort'
})
export class MealSortPipe implements PipeTransform {
  constructor(private vs: ValidationService) {}
  transform(items: [Meal]): [Meal] {
    if (!items) {
      return items;
    }
    return items.sort((m1, m2) => this.vs.compareMeals(m1, m2)) as [Meal];
  }
}
@NgModule({
  declarations: [
    MealSortPipe
  ],
  exports: [MealSortPipe]
})
export class MealSortPipeModule { }
