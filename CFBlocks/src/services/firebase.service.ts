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
    return this.mapSnapShotChanges(this.getUserAccountQuery(username));

    // return this.getUserAccountQuery(username).snapshotChanges().pipe(map(action => {
    //     const data = action.payload.data() as User;
    //     const id = action.payload.id;
    //     return { id, ...data };
    //   })
    // );
  }
  createNewUserAccount(user: User) {
    return this.getUserAccountQuery(user.username).set(this.formatObj(user));
  }
  updateUserAccount(user: User) {
    return this.getUserAccountQuery(user.username).update(this.formatObj(user));
  }

  // Food Creation
  private queryAllFoods() {
    return this.firebaseDb.collection('food');
  }
  getAllFoods() {
    return this.mapSnapShotChanges(this.queryAllFoods());
  }
  queryFood(food: Food) {
    return this.firebaseDb.collection('food').doc(food.name);
  }
  getFood(food: Food) {
    return this.mapSnapShotChanges(this.queryFood(food));
  }
  /*addFood(food: Food) {
    return this.firebaseDb.list(`food/`).push(food);
  }*/
  updateFood(food: Food) {
    return this.queryFood(food).update(food);
  }
  /*removeFood(food: Food) {
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
  formatObj(obj: any) {
    return JSON.parse( JSON.stringify(obj));
  }
}
