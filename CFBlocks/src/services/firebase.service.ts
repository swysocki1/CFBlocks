import { AngularFirestore } from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth';
import {Injectable} from '@angular/core';
import {Food} from '../models/meal.module';
import {User} from '../models/user.model';
import { map } from 'rxjs/operators';
import {Subscription} from 'rxjs/internal/Subscription';

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
    return this.getUserAccountQuery(username).snapshotChanges().pipe(map(action => {
        const data = action.payload.data() as User;
        const id = action.payload.id;
        return { id, ...data };
      })
    );
  }
  createNewUserAccount(user: User) {
    return this.getUserAccountQuery(user.username).set(Object.assign({}, user));
  }
  updateUserAccount(user: User) {
    return this.getUserAccountQuery(user.username).update(user);
  }

  // Food Creation
  /*getAllFoods() {
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
  }*/

  // Email Encode/Decode
  encodeEmail(email: string): string {
    email = email.replace('.', ',');
    return email;
  }
  decodeEmail(email: string): string {
    email = email.replace(',', '.');
    return email;
  }
}
