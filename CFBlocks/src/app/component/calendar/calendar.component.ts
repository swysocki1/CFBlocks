import {Component, Input, OnInit} from '@angular/core';
import {CalendarDay, CalendarMonth} from './calendar.model';
import {CalendarService} from './calendar.service';
import * as moment from 'moment';
import {Meal, MealCalendar} from '../../../models/meal.module';
import {MealService} from '../../../services/meal.service';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.html'
})
export class CalendarComponent {
  daysOfWeek: [string] = [] as [string];
  monthsOfYear: [string] = [] as [string];
  month: CalendarMonth = new CalendarMonth();
  selectedDate = moment(new Date()).startOf('day').toDate();
  mealCalendar: [MealCalendar];
  constructor(private cs: CalendarService, private mealService: MealService) {
    this.daysOfWeek = this.cs.getDaysOfWeek();
    this.monthsOfYear = this.cs.getMonthsOfYear();
    this.month = this.cs.getMonth(moment(this.selectedDate).year(), moment(this.selectedDate).month());
    this.getMealCalendar();
  }
  goToMonth(dateOfMonth: Date) {
    const year = moment(dateOfMonth).year();
    const month = moment(dateOfMonth).month();
    this.month = this.cs.getMonth(year, month);
  }
  goBackMonth() {
    this.selectedDate = moment(this.selectedDate).subtract(1, 'months').toDate();
    this.goToMonth(this.selectedDate);
  }
  goNextMonth() {
    this.selectedDate = moment(this.selectedDate).add(1, 'months').toDate();
    this.goToMonth(this.selectedDate);
  }
  toggleToday(): void {
    this.selectDate(moment().toDate());
  }
  selectDate(date: Date) {
    if (!this.selectedDate || !this.isSameDay(date, this.selectedDate)) {
      this.selectedDate = date;
      if (!this.cs.dateInCalendarMonth(this.month, this.selectedDate)) {
        this.goToMonth(this.selectedDate);
      }
    } else {
      this.selectedDate = null;
    }
  }
  isSameDay(date1: Date, date2: Date) {
    return this.cs.isSameDay(date1, date2);
  }
  todayIsSelected() {
    return this.isSameDay(this.selectedDate, new Date());
  }
  getMeal(day: CalendarDay): [Meal] {
    if (day) {
      const mealCalendar = this.mealCalendar.find(meal => moment(meal.date).isSame(moment(day.date)));
      if (mealCalendar) {
        return mealCalendar.meals;
      }
    }
    return [] as [Meal];
  }
  getMealCalendar(start?: Date, end?: Date) {
    if (start && end) {
      this.mealService.getMealCalendar(start, end).subscribe(mealCalendar => {
        this.mealCalendar = mealCalendar;
      });
    } else {
      this.month.weeks.forEach(week => {
        week.days.forEach(day => {
          if (moment(day.date).isBefore(moment(start)) || start === null) {
            start = day.date;
          }
          if (moment(day.date).isAfter(moment(end)) || end === null) {
            end = day.date;
          }
        });
      });
      if (start && end) {
        this.mealService.getMealCalendar(start, end).subscribe(mealCalendar => {
          this.mealCalendar = mealCalendar;
        });
      } else {
        console.error('Unable to get the current start and end dates of the calendar');
        this.mealCalendar = [] as [MealCalendar];
      }
    }
  }
}
