import { AngularFirestore } from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth';
import {Injectable} from '@angular/core';
import {Food, Meal, MealCalendar} from '../models/meal.module';
import {User} from '../models/user.model';
import { map } from 'rxjs/operators';
import {Subscription} from 'rxjs/internal/Subscription';
import * as moment from 'moment';

@Injectable()
export class FirebaseService {
  subscriptions: Subscription[] = [];

  constructor(private firebaseDb: AngularFirestore,
              private firebaseAuth: AngularFireAuth) {
    firebaseAuth.auth.onAuthStateChanged(state => {
      if (!state) {
        while (this.subscriptions.length > 0) {
          const subscription = this.subscriptions.pop();
          if (subscription) {
            subscription.unsubscribe();
          }
        }
      }
    });
  }
  private mapSnapShotChanges(query: any) {
    return query.snapshotChanges().pipe(map(action => {
        const data = action['payload'].data();
        const id = action['payload'].id;
        return { id, ...data };
      })
    );
  }
  // User Accounts
  createUserWithEmailAndPassword(email, password) {
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
  }
  signInWithEmailAndPassword(email, password) {
    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }
  getUserAccountCollection() {
    return this.firebaseDb.collection(`userAccount`);
  }
  getUserAccountQuery(username: string) {
    return this.getUserAccountCollection().doc(this.encodeEmail(username));
  }
  getUserAccount(username) {
    // return this.mapSnapShotChanges(this.getUserAccountQuery(username));

    return this.getUserAccountQuery(username).snapshotChanges().pipe(map(action => {
        const data = action.payload.data() as User;
        const id = action.payload.id;
        return { id, ...data };
      })
    );
  }
  createNewUserAccount(user: User) {
    return this.getUserAccountQuery(user.username).set(this.formatObj(user));
  }
  updateUserAccount(user: User) {
    return this.getUserAccountQuery(user.username).update(this.formatObj(user));
  }

  // Food Creation
  queryAllFoods() {
    return this.firebaseDb.collection('food');
  }
  getAllFoods() {
    // return this.mapSnapShotChanges(this.queryAllFoods());
    return this.queryAllFoods().snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Food;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    }));
  }
  queryFood(food: Food) {
    if (food && !food.id) {
      food.id = this.firebaseDb.createId();
    }
    return this.firebaseDb.collection('food').doc(food.id);
  }
  getFoodByRef(ref) {
    return ref.get();
  }
  // getFood(food: Food) {
  //   return this.mapSnapShotChanges(this.queryFood(food));
  // }
  createFood(food: Food) {
    return this.queryFood(food).set(this.formatObj(food));
  }
  updateFood(food: Food) {
    return this.queryFood(food).update(this.formatObj(food));
  }
  /*removeFood(food: Food) {
    return this.getFood(food).remove().catch(error => {
      console.error(error);
    });
  }*/

  queryMealCalendarByDateRange(user: User, startRange?: Date, endRange?: Date) {
    return this.firebaseDb.collection(`mealCalendar`, ref => {
      if (startRange && endRange) {
        // return ref.orderBy('date').startAt(startRange).endAt(endRange.getTime());
        return ref.where('user', '==', user.id).where('date', '>=', startRange).where('date', '<=', endRange);
      } else {
        return ref;
      }
    });
  }
  getMealCalendarByDateRange(user: User, startRange?: Date, endRange?: Date) {
    return this.queryMealCalendarByDateRange(user, startRange, endRange).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as MealCalendar;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    }));
  }
  queryMealCalendarOnDay(user: User, date?: Date) {
    return this.queryMealCalendarByDateRange(user, moment(date).startOf('day').toDate(), moment(date).endOf('day').toDate());
  }
  getMealCalendarOnDay(user: User, date: Date) {
    return this.queryMealCalendarOnDay(user, date).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    }));
  }
  queryMealCalendarById(id: string) {
    return this.firebaseDb.collection(`mealCalendar`).doc(id);
  }
  createMealCalendar(mc) {
    mc.id = this.firebaseDb.createId();
    return this.queryMealCalendarById(mc.id).set(mc);
  }
  updateMealCalendar(mc) {
    return this.queryMealCalendarById(mc.id).update(mc);
  }
  // Email Encode/Decode
  encodeEmail(email: string): string {
    if (email) {
      email = email.replace('.', ',');
    }
    return email;
  }
  decodeEmail(email: string): string {
    if (email) {
      email = email.replace(',', '.');
    }
    return email;
  }
  formatObj(obj: any) {
    return JSON.parse( JSON.stringify(obj));
  }
}
