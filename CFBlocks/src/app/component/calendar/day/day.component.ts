import {Component, Input} from '@angular/core';
import {CalendarDay} from '../calendar.model';
import {Meal} from '../../../../models/meal.module';
import {MealService} from '../../../../services/meal.service';

@Component({
  selector: 'calendar-day',
  templateUrl: './day.html',
  styles: [`
    .day {
      opacity: .25;
      height: 0;
      padding-bottom: 100%;
    }
    .day.valid-month {
      opacity: 1;
    }
    .day.is-selected .dayNumber{
      background-color: red;
      padding: 5px;
    }
    .breakfast, .lunch, .dinner, .snack { }
  `]
})
export class DayComponent {
  @Input() day: CalendarDay;
  @Input() meals: [Meal];
  @Input() isSelected: boolean;

  constructor(private mealService: MealService) { }

  showMeal() { }
  getMealDisplay(meal: Meal) {
    return this.mealService.getMealDisplay(meal);
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
}
