import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CalendarComponent} from './calendar.component';
import {CalendarService} from './calendar.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DayComponent, MealSortPipe} from './day/day.component';

@NgModule({
  declarations: [
    CalendarComponent,
    DayComponent,
    MealSortPipe
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [CalendarComponent],
  providers: [CalendarService]
})
export class CalendarModule { }
