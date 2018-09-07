import * as moment from 'moment';

export class CalendarMonth {
  id: string;
  name: string;
  year: number;
  weeks: [CalendarWeek] = [] as [CalendarWeek];
}

export class CalendarWeek {
  id: string;
  month: string;
  days: [CalendarDay] = [] as [CalendarDay];
}
export class CalendarDay {
  id: string;
  dayOfWeek: string;
  dayOfMonth: number;
  month: string;
  date: Date;
  isThisMonth: boolean;
  constructor(date?: Date, isThisMonth?: boolean) {
    if (date) {
      const day = moment(date);
      this.dayOfWeek = daysOfWeek[day.weekday()];
      this.dayOfMonth = day.date();
      this.month = monthsOfYear[day.month()];
      this.date = day.toDate();
      this.id = '???'; // TODO ID ????
      this.isThisMonth = !!isThisMonth;
    }
  }
}

export const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
  'November', 'December'];
