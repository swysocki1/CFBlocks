import {Component, Input, OnInit, Pipe, PipeTransform} from '@angular/core';
import {CalendarDay, CalendarMonth, CalendarWeek} from './calendar.model';
import {CalendarService} from './calendar.service';
import * as moment from 'moment';
declare var $: any;
import {Meal, MealCalendar} from '../../../models/meal.module';
import {MealService} from '../../../services/meal.service';
import {Router} from '@angular/router';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.html',
  styles: [`
    #calendar-date-input {
      width: 125px;
      border: 0;
      border-bottom: 1px dotted #fff;
      background: none;
      outline: 0;
      padding: 0;
      color: #fff;
      font-size: 23px;
      line-height: 1;
      font-weight: bold;
      color: #fff;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
      margin: 0;
      cursor: pointer;
    }
  `]
})
export class CalendarComponent implements OnInit {
  @Input() name: string;
  daysOfWeek: [string] = [] as [string];
  monthsOfYear: [string] = [] as [string];
  month: CalendarMonth = new CalendarMonth();
  selectedDate: Date;
  mealCalendar: [MealCalendar];
  view = 'Monthly';
  constructor(private cs: CalendarService, private mealService: MealService, private router: Router) { }
  ngOnInit() {
    this.daysOfWeek = this.cs.getDaysOfWeek();
    this.monthsOfYear = this.cs.getMonthsOfYear();
    this.selectDate(moment(new Date()).startOf('day').toDate());
    $('#calendar-date-dropdown-menu').datepicker({startDate: this.selectedDate}).on('changeDate', (event) => {
      this.selectDate(event.date);
    });
    // this.month = this.cs.getMonth(moment(this.selectedDate).year(), moment(this.selectedDate).month());
    this.getMealCalendar();
  }
  goToMonth(dateOfMonth: Date) {
    const year = moment(dateOfMonth).year();
    const month = moment(dateOfMonth).month();
    this.month = this.cs.getMonth(year, month);
  }
  goToBiWeekly(dateOfMonth: Date) {
    const year = moment(dateOfMonth).year();
    const month = moment(dateOfMonth).month();
    const m = this.cs.getMonth(year, month);
    m.weeks = m.weeks.filter(week => this.isSameDay(week.days[0].date, moment(dateOfMonth).startOf('week').toDate()) ||
      this.isSameDay(week.days[0].date, moment(dateOfMonth).startOf('week').add(7, 'days').toDate())
    ) as [CalendarWeek];
    this.month = m;
  }
  goToWeekly(dateOfMonth: Date) {
    const year = moment(dateOfMonth).year();
    const month = moment(dateOfMonth).month();
    const m = this.cs.getMonth(year, month);
    m.weeks = m.weeks.filter(week => this.isSameDay(week.days[0].date, moment(dateOfMonth).startOf('week').toDate())) as [CalendarWeek];
    this.month = m;
  }
  goBackMonth() {
    if (this.view === 'Weekly') {
      this.selectedDate = moment(this.selectedDate).subtract(1, 'weeks').toDate();
      this.goToWeekly(this.selectedDate);
    } else if (this.view === 'Bi-Weekly') {
      this.selectedDate = moment(this.selectedDate).subtract(1, 'weeks').toDate();
      this.goToBiWeekly(this.selectedDate);
    } else if (!this.view || this.view === 'Monthly') {
      this.selectedDate = moment(this.selectedDate).subtract(1, 'months').toDate();
      this.goToMonth(this.selectedDate);
    }
  }
  goNextMonth() {
    if (this.view === 'Weekly') {
      this.selectedDate = moment(this.selectedDate).add(1, 'weeks').toDate();
      this.goToWeekly(this.selectedDate);
    } else if (this.view === 'Bi-Weekly') {
      this.selectedDate = moment(this.selectedDate).add(1, 'weeks').toDate();
      this.goToBiWeekly(this.selectedDate);
    } else if (!this.view || this.view === 'Monthly') {
      this.selectedDate = moment(this.selectedDate).add(1, 'months').toDate();
      this.goToMonth(this.selectedDate);
    }
  }
  toggleToday(): void {
    this.selectDate(moment().toDate());
  }
  selectDate(date: Date) {
    if (!this.selectedDate || !this.isSameDay(date, this.selectedDate)) {
      this.selectedDate = date;
      if (!this.cs.dateInCalendarMonth(this.month, this.selectedDate)) {
        if (!this.view || this.view === 'Monthly') {
          this.goToMonth(this.selectedDate);
        } else if (this.view === 'Weekly') {
          this.goToWeekly(this.selectedDate);
        } else if (this.view === 'Bi-Weekly') {
          this.goToBiWeekly(this.selectedDate);
        }
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
  getMealCalendar(start?: Date, end?: Date, doNotRepeat?: boolean) {
    if (start && end) {
      this.mealService.getMealCalendar(start, end).subscribe(mealCalendar => {
        this.mealCalendar = mealCalendar;
      });
    } else {
      this.month.weeks.forEach(week => {
        week.days.forEach(day => {
          if (moment(day.date).isBefore(moment(start)) || start === undefined) {
            start = day.date;
          }
          if (moment(day.date).isAfter(moment(end)) || end === undefined) {
            end = day.date;
          }
        });
      });
      if (doNotRepeat) {
        console.error('could not find start and end date of meal planner');
      } else {
        this.getMealCalendar(start, end, true);
      }
    }
  }
  isCurrentView(view): boolean {
    return this.view === view;
  }
  loadView(view) {
    this.view = view;
    if (this.view === 'Weekly') {
      this.goToWeekly(this.selectedDate);
    } else if (this.view === 'Bi-Weekly') {
      this.goToBiWeekly(this.selectedDate);
    } else if (!this.view || this.view === 'Monthly') {
      this.goToMonth(this.selectedDate);
    } else if(this.view === 'Day') {
      this.router.navigate(['/meal-builder', moment(this.selectedDate).format('MMDDYY')]);
    }
  }
}
