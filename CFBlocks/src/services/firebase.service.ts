import {Subscription} from 'rxjs/Subscription';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import {Injectable} from '@angular/core';
import {Food} from '../models/meal.module';

@Injectable()
export class FirebaseService {
  subscriptions: Subscription[] = [];

  constructor(private firebaseDb: AngularFireDatabase,
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
  getAllFoods() {
    return this.firebaseDb.list(`food`);
  }
  getFood(food: Food) {
    return this.firebaseDb.object(`food/${food['$key']}`);
  }
  addFood(food: Food) {
    return this.firebaseDb.list(`food/`).push(food);
  }
  updateFood(food: Food) {
    return this.getFood(food).update(food).catch(error => {
      console.error(error);
    });
  }
  removeFood(food: Food) {
    return this.getFood(food).remove().catch(error => {
      console.error(error);
    });
  }
}
