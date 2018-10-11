import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CalendarComponent} from './calendar.component';
import {CalendarService} from './calendar.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DayComponent} from './day/day.component';
import {MomentPipeModule} from '../../pipe/moment.pipe';
import {MealSortPipeModule} from '../../pipe/mealSort.pipe';

@NgModule({
  declarations: [
    CalendarComponent,
    DayComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    MomentPipeModule,
    MealSortPipeModule
  ],
  exports: [CalendarComponent],
  providers: [CalendarService]
})
export class CalendarModule { }
