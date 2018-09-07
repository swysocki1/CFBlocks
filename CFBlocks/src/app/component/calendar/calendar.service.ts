import {Injectable} from '@angular/core';
import {CalendarDay, CalendarMonth, CalendarWeek, daysOfWeek, monthsOfYear} from './calendar.model';
import * as moment from 'moment';

@Injectable()
export class CalendarService {
  getMonthOfYear(x: number): string {
    if (x < monthsOfYear.length) {
      return monthsOfYear[x];
    } else {
      return null;
    }
  }
  getMonthsOfYear(): [string] {
    return monthsOfYear as [string];
  }
  getDayOfWeek(x: number): string {
    if (x < daysOfWeek.length) {
      return daysOfWeek[x];
    } else {
      return null;
    }
  }
  getDaysOfWeek(): [string] {
    return daysOfWeek as [string];
  }
  // getYear(year: number): CalendarYear {
  //   const date = moment().year(year).startOf('year').toDate();
  //   const calendarMonth = this.createYear(date);
  //   return calendarMonth;
  // }
  getMonth(year: number, month: number): CalendarMonth {
    const date = moment().year(year).month(month).startOf('month').toDate();
    const calendarMonth = this.createMonth(date);
    return calendarMonth;
  }
  getDay(year: number, month: number, day: number): CalendarDay {
    const date = moment().year(year).month(month).date(day).toDate();
    const calendarDay = this.createDay(date);
    return calendarDay;
  }
  private createDay(date: Date, isThisMonth?: boolean): CalendarDay {
    if (date) {
      return new CalendarDay(date, isThisMonth);
    } else {
      return null;
    }
  }
  private createWeek(start: Date): CalendarWeek {
    const week: CalendarWeek = new CalendarWeek();
    const firstOfMonth: Date = moment(start).startOf('month').toDate();
    const lastOfMonth: Date = moment(start).endOf('month').toDate();
    const startOfWeek: Date = moment(start).startOf('week').toDate();
    const endOfWeek: Date = moment(start).endOf('week').toDate();
    for (let day = startOfWeek; moment(day).isSameOrBefore(moment(endOfWeek)); day = moment(day).add(1, 'days').toDate()) {
      const isThisMonth = !(moment(day).isBefore(moment(firstOfMonth)) || (moment(day).isAfter(moment(lastOfMonth))));
      const newDay = this.createDay(day, isThisMonth);
      // if (moment(day).isBefore(moment(firstOfMonth)) || (moment(day).isAfter(moment(lastOfMonth)))) { // Uncomment to hide not this month
      //   week.days.push(null);
      // } else {
      //   week.days.push(newDay);
      // }
      week.days.push(newDay);
    }
    return week;
  }
  private createMonth(dayInMonth: Date): CalendarMonth {
    const month = new CalendarMonth();
    const start = moment(dayInMonth).startOf('month').toDate();
    month.name = this.getMonthsOfYear()[moment(dayInMonth).month()];
    month.year = moment(dayInMonth).year();
    for (let week = start; moment(week).startOf('week').isBefore(moment(start).endOf('month')); week = moment(week).add(1, 'weeks').toDate()) {
      if (moment(week).month() !== moment(start).month()) {
        week = moment(week).startOf('week').toDate();
      }
      const newWeek = this.createWeek(week);
      month.weeks.push(newWeek);
    }
    return month;
  }
  // private createYear(dayInYear: Date): CalendarYear {
  //   const calendarYear = new CalendarYear();
  //   const start = moment(dayInYear).startOf('year').toDate();
  //   for(let month = start; moment(month).isBefore(moment(start).add(1, 'year')); month = moment(month).add(1, 'months').toDate()) {
  //     calendarYear.months.push(this.createMonth(month));
  //   }
  //   return calendarYear;
  // }
}
