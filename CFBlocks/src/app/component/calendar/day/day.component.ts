import {Component, EventEmitter, Input, Output, Pipe, PipeTransform} from '@angular/core';
import {CalendarDay} from '../calendar.model';
import {Meal} from '../../../../models/meal.module';
import {MealService} from '../../../../services/meal.service';
import {ValidationService} from '../../../../services/validation.service';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {CalendarService} from '../calendar.service';

@Component({
  selector: 'calendar-day',
  templateUrl: './day.html',
  styles: [`
    .day {
      opacity: .25;
      height: 0;
      padding-bottom: 100%;
      width: 100%;
      min-width: 135px;
    }
    .day.valid-month {
      opacity: 1;
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
    .meal-text {
      padding:0 .5em;
    }
    h5 {
      margin-bottom: 0;
    }
  `]
})
export class DayComponent {
  @Input() day: CalendarDay;
  @Input() meals: [Meal];
  @Input() isSelected: boolean;
  @Input() view: string;
  @Output() updateSelectedDate: EventEmitter<Date> = new EventEmitter<Date>();

  constructor(private mealService: MealService, private router: Router, private cs: CalendarService) { }
  addMeal() {
    this.router.navigate(['/meal-builder', moment(this.day.date).format('MMDDYY')]);
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
  validMonth(isValid: boolean): boolean {
    if (this.view === 'Monthly') {
      return isValid;
    } else {
      return true;
    }
  }
  selectDate(date: Date) {
    this.updateSelectedDate.emit(date);
  }
  isToday(date: Date) {
    return this.cs.isSameDay(date, moment().toDate());
  }
}
