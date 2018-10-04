import {Component, Input, Pipe, PipeTransform} from '@angular/core';
import {CalendarDay} from '../calendar.model';
import {Meal} from '../../../../models/meal.module';
import {MealService} from '../../../../services/meal.service';
import {ValidationService} from '../../../../services/validation.service';
import {Router} from '@angular/router';
import * as moment from 'moment';
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
@Component({
  selector: 'calendar-day',
  templateUrl: './day.html',
  styles: [`
    .day {
      opacity: .25;
      height: 0;
      padding-bottom: 100%;
      margin-top:-9px;
      margin-right:-9px;
      margin-left:-9px;
    }
    .day.valid-month {
      opacity: 1;
    }
    .day.is-selected .dayNumber{
      padding: 5px;
      color: #fff;
    }
    .breakfast, .lunch, .dinner, .snack { }
    .add-meal {
      display:inline-block;
      padding:6px;
      opacity: 0.3;
    }
    .add-meal:hover {
      opacity:1;
    }
  `]
})
export class DayComponent {
  @Input() day: CalendarDay;
  @Input() meals: [Meal];
  @Input() isSelected: boolean;

  constructor(private mealService: MealService, private router: Router) { }
  addMeal() {
    this.router.navigate(['/meal-builder', moment(this.day.date).format('MMDDYYYY')]);
  }
  showMeal() { }
  getMealDisplay(meal: Meal) {
    return this.formatName(this.mealService.getMealDisplay(meal));
  }
  isBreakFast(meal: Meal): boolean {
    return this.mealService.isBreakFast(meal);
  }
  isLunch(meal: Meal): boolean {
    return this.mealService.isLunch(meal);
  }
  isDinner(meal: Meal): boolean {
    return this.mealService.isDinner(meal);
  }
  isSnack(meal: Meal): boolean {
    return this.mealService.isSnack(meal);
  }
  formatName(name: string) {
    if (name && name.trim() && name.trim().length > 20) {
      return name.trim().substr(0, 17) + '...';
    } else if (name && name.trim()) {
      return name.trim();
    } else {
      return name;
    }
  }
}
