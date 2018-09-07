import {Component, Input} from '@angular/core';
import {CalendarDay} from '../calendar.model';

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
  `]
})
export class DayComponent {
  @Input() day: CalendarDay;
}
