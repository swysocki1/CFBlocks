import * as moment from 'moment';
import {Injectable} from '@angular/core';
import {Food, MealCalendar} from '../models/meal.module';
import {User} from '../models/user.model';
import {map} from 'rxjs/operators';
import {FirebaseService} from './firebase.service';
import {Observable} from 'rxjs/internal/Observable';
import {deepCopy} from '../util/deepCopy.util';
import {CalendarService} from '../app/component/calendar/calendar.service';

@Injectable()
export class FirebaseAbstractionLayerService {
  constructor(private fs: FirebaseService, private cs: CalendarService) { }
  getMealCalendarByDateRange(user: User, startRange?: Date, endRange?: Date) {
    return new Observable(sub => {
      this.fs.queryMealCalendarByDateRange(user, startRange, endRange).snapshotChanges().pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as MealCalendar;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe( mealCalendar => {
        if (mealCalendar) {
          if (mealCalendar.length > 0) {
            mealCalendar.forEach((day, d) => {
              if (day.date) {
                mealCalendar[d].date = (<any>day.date).toDate();
              }
              day.meals.forEach((meal, m) => {
                meal.foods.forEach((food, f) => {
                  food.foodRef.get().then(res => {
                    mealCalendar[d].meals[m].foods[f].foodRef = null;
                    mealCalendar[d].meals[m].foods[f].food = res.data() as Food;
                  }, error => {
                    sub.error(error);
                  });
                });
              });
            });
            // console.log(mealCalendar);
            // if (this.cs.isSameDay(startRange, endRange)) {
            //   sub.next(mealCalendar[0] as MealCalendar);
            // } else {
              sub.next(mealCalendar as [MealCalendar]);
            // }
          } else {
            sub.next([] as [MealCalendar]);
          }
        } else {
          sub.next([] as [MealCalendar]);
        }
      }, error => {
        sub.error(error);
      });
    });
  }
  getMealCalendarOnDay(user: User, date: Date) {
    return new Observable(sub => {
      this.fs.queryMealCalendarByDateRange(user, moment(date).startOf('day').toDate(), moment(date).endOf('day').toDate())
        .snapshotChanges().pipe(map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as MealCalendar;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })).subscribe( data => {
        if (data) {
          if (data.length > 0) {
            data[0].meals.forEach((meal, m) => {
              meal.foods.forEach((food, f) => {
                food.foodRef.get().then(res => {
                  data[0].meals[m].foods[f].foodRef = null;
                  data[0].meals[m].foods[f].food = res.data() as Food;
                }, error => {
                  sub.error(error);
                });
              });
            });
            sub.next(data[0] as MealCalendar);
          } else {
            sub.next(null);
          }
        } else {
          sub.next(null);
        }
      }, error => {
        sub.error(error);
      });
    });
  }
  saveMealCalendar(user: User, mc: MealCalendar) {
    const copy = this.mealCalendarDeepCopy(user, mc);
    if (mc && !mc.id) {
      return this.fs.createMealCalendar(copy);
    } else {
      return this.fs.updateMealCalendar(copy);
    }
  }

  private mealCalendarDeepCopy(user: User, obj: MealCalendar) {
    const copy = deepCopy(obj);
    if (copy && copy.meals && copy.meals.length > 0 && copy.meals.some(meal => meal.foods && meal.foods.length > 0)) {
      copy.meals.forEach((meal, m) => {
        meal.foods.forEach((food, f) => {
          copy.meals[m].foods[f].foodRef = this.fs.queryFood(food.food).ref;
          copy.meals[m].foods[f].food = null;
        });
      });
    }
    copy.user = user.id;
    return copy;
  }
}
