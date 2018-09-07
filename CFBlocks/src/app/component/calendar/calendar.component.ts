import {Component, Input, OnInit} from '@angular/core';
import {CalendarMonth} from './calendar.model';
import {CalendarService} from './calendar.service';
import * as moment from 'moment';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.html'
})
export class CalendarComponent {
  daysOfWeek: [string] = [] as [string];
  monthsOfYear: [string] = [] as [string];
  month: CalendarMonth = new CalendarMonth();
  selectedDate = moment().toDate();
  constructor(private cs: CalendarService) {
    this.daysOfWeek = this.cs.getDaysOfWeek();
    this.monthsOfYear = this.cs.getMonthsOfYear();
    this.month = this.cs.getMonth(moment(this.selectedDate).year(), moment(this.selectedDate).month());
  }
  goBackMonth() {
    this.selectedDate = moment(this.selectedDate).subtract(1, 'months').toDate();
    const year = moment(this.selectedDate).year();
    const month = moment(this.selectedDate).month();
    this.month = this.cs.getMonth(year, month);
  }
  goNextMonth() {
    this.selectedDate = moment(this.selectedDate).add(1, 'months').toDate();
    const year = moment(this.selectedDate).year();
    const month = moment(this.selectedDate).month();
    this.month = this.cs.getMonth(year, month);
  }
}
