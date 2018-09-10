import {Injectable} from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class HelperService {
  startOfDay(date?: Date): Date {
    if (!date) {
      date = new Date();
    }
    return moment(date).startOf('day').toDate();
  }
  endOfDay(date?: Date): Date {
    if (!date) {
      date = new Date();
    }
    return moment(date).endOf('day').toDate();
  }
}
