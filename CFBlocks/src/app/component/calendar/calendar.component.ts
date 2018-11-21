import {Component, Input, OnInit, Pipe, PipeTransform} from '@angular/core';
import {CalendarDay, CalendarMonth, CalendarWeek} from './calendar.model';
import {CalendarService} from './calendar.service';
import * as moment from 'moment';
declare var $: any;
import {Meal, MealCalendar} from '../../../models/meal.module';
import {MealService} from '../../../services/meal.service';
import {Router} from '@angular/router';
import {LoginService} from '../../../services/login.service';
import {FirebaseAbstractionLayerService} from '../../../services/firebaseAbstractionLayer.service';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.html',
  styles: [`
    .meal-calendar-heading {
      position: sticky;
      position: -webkit-sticky;
      top: 45px;
      z-index: 1;
    }
  `]
})
export class CalendarComponent implements OnInit {
  @Input() name: string;
  daysOfWeek: [string] = [] as [string];
  monthsOfYear: [string] = [] as [string];
  month: CalendarMonth = new CalendarMonth();
  selectedDate: Date;
  mealCalendar: [MealCalendar] = [] as [MealCalendar];
  view = 'Monthly';
  constructor(private cs: CalendarService, private mealService: MealService, private router: Router, private ls: LoginService, private fsa: FirebaseAbstractionLayerService) { }
  ngOnInit() {
    this.daysOfWeek = this.cs.getDaysOfWeek();
    this.monthsOfYear = this.cs.getMonthsOfYear();
    this.selectDate(moment(new Date()).startOf('day').toDate());
    $('#calendar-date-dropdown-menu').datepicker({
      todayHighlight: true
    }).datepicker('update', this.selectedDate).on('changeDate', (event) => {
      if (!this.isSameDay(event.date, this.selectedDate)) {
        this.selectDate(event.date);
      }
    });
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
    if (!this.isSameDay(moment().toDate(), this.selectedDate)) {
      this.selectDate(moment().toDate());
    }
  }
  selectDate(date: Date) {
    if (!this.selectedDate || !this.isSameDay(date, this.selectedDate)) {
      this.selectedDate = date;
      $('#calendar-date-dropdown-menu').datepicker('update', this.selectedDate);
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
      if (this.selectedDate) {
        this.router.navigate(['/meal-builder', moment(this.selectedDate).format('MMDDYY')]);
      }
    }
  }
  isSameDay(date1: Date, date2: Date) {
    return this.cs.isSameDay(date1, date2);
  }
  todayIsSelected() {
    return this.isSameDay(this.selectedDate, new Date());
  }
  getMeal(day: CalendarDay): [Meal] {
    // if (this.cs.isSameDay(day.date, new Date())) {
    //   console.log(this.mealCalendar);
    //   console.log(day.date);
    //   this.mealCalendar.forEach(m => {
    //     console.log(m.date);
    //     if (this.cs.isSameDay(day.date, moment(m.date).toDate())) {
    //       console.log(m);
    //     }
    //   });
    // }
    if (day) {
      const mealCalendar = this.mealCalendar.find(meal => this.cs.isSameDay(new Date(meal.date), day.date));
      if (mealCalendar) {
        return mealCalendar.meals;
      }
    }
    return [] as [Meal];
  }
  getMealCalendar(start?: Date, end?: Date, doNotRepeat?: boolean) {
    if (start && end) {
      // this.mealService.getMealCalendar(start, end).subscribe(mealCalendar => {
      //   this.mealCalendar = mealCalendar;
      // });
      if (this.ls.getUserSession().authenticated) {
        this.fsa.getMealCalendarByDateRange(this.ls.getUser(), start, end).subscribe((mc: any) => {
          if (mc) {
            this.mealCalendar = mc;
          }
          // } else {
          //   this.mealCalendar.forEach(mealCalendar => {
          //     mealCalendar.date = date;
          //   });
          //   this.mealCalendar.date = date;
          //   this.mealCalendar.user = this.user.id;
          // }
        }, error => {
          console.error(error);
        });
      }
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
