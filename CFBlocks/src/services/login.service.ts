/**
 * Created by swysocki on 5/10/18.
 */

import {EventEmitter, Injectable} from '@angular/core';
import {User, UserSession} from '../models/user.model';
import * as moment from 'moment';
import {FirebaseService} from './firebase.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {Observable} from 'rxjs/internal/Observable';

@Injectable()
export class LoginService {
  private _user: User = new User();
  private _userSession: UserSession = new UserSession();
  private loginSubscription: Subscription;
  getUserUpdates: EventEmitter<User> = new EventEmitter<User>();
  getUserSessionUpdates: EventEmitter<UserSession> = new EventEmitter<UserSession>();
  getUser(): User {
    return this._user;
  }

  private setUser(value: User, updateUserSession?: boolean) {
    this._user = value;
    this.getUserUpdates.emit(this._user);
    if (updateUserSession) {
      this._userSession.user = this._user;
      this.getUserSessionUpdates.emit(this._userSession);
    }
  }

  getUserSession(): UserSession {
    return this._userSession;
  }

  private setUserSession(value: UserSession) {
    this._userSession = value;
    this.getUserSessionUpdates.emit(this._userSession);
    if (value) {
      this.setUser(value.user);
    }
  }

  constructor(private firebaseService: FirebaseService) {
    const cachedSession: UserSession = JSON.parse(localStorage.getItem('CFBlocks'));
    if (cachedSession && cachedSession.user.username && cachedSession.lastLogin &&
      moment(cachedSession.lastLogin).isSameOrAfter(moment().subtract(1, 'days'))) {
      this.setUserSession(cachedSession);
    } else {
      localStorage.removeItem('CFBlocks');
    }
  }
  login(username: string, password: string): Observable<UserSession> {
    this.closeActiveLoginSubscription();
    return new Observable(subscriber => {
      let cachedSession: UserSession = JSON.parse(localStorage.getItem('CFBlocks'));
      if (cachedSession && cachedSession.user.username === username && cachedSession.lastLogin &&
        moment(cachedSession.lastLogin).isSameOrAfter(moment().subtract(1, 'days'))) {
        cachedSession.lastLogin = new Date();
        localStorage.setItem('CFBlocks', JSON.stringify(cachedSession));
        subscriber.next(cachedSession);
        subscriber.complete();
      } else if (cachedSession) {
        localStorage.removeItem('CFBlocks');
        cachedSession = null;
      }
      if (!cachedSession) {
        this.firebaseService.signInWithEmailAndPassword(username, password).then(() => {
          const userSession = new UserSession();
          userSession.created = new Date();
          userSession.lastLogin = userSession.created;
          userSession.authenticated = true;
          // userSession.setTestUser(); // Setting test user // Needs to be deleted
          this.firebaseService.getUserAccount(username).subscribe(user => {

            userSession.user = user as User;

            localStorage.setItem('CFBlocks', JSON.stringify(userSession));
            this.setUserSession(userSession);
            subscriber.next(userSession);
            subscriber.complete();
          });
        }).catch((error) => {
          subscriber.error(error);
          subscriber.complete();
        });
      }
    });
  }
  logout(): Observable<UserSession> {
    return new Observable(subscriber => {
      localStorage.removeItem('CFBlocks');
      this.setUserSession(null);
      subscriber.next(this.getUserSession());
      subscriber.complete();

      // TODO error on logging out
    });
  }
  hasAdmin() {
    if (this._userSession && this._userSession.roles) {
      const userRoles = this._userSession.roles;
      return userRoles.some(role => role.type === 'ADMIN');
    } else {
      return false;
    }
  }
  isAdmin(): boolean {
    if (this.hasAdmin()) {
      if (this._userSession && this._userSession.roles) {
        const userRoles = this._userSession.roles;
        return userRoles.some(role => role.type === 'ADMIN' && role.active);
      } else {
        return false;
      }
    }
  }
  toggleAdmin(): Observable<UserSession> {
    return new Observable(subscriber =>  {
      try {
        if (this.isAdmin()) {
          this._userSession.roles.find(role => role.type === 'ADMIN' && role.active).active = false;
        } else if (this.hasAdmin()) {
          this._userSession.roles.find(role => role.type === 'ADMIN' && !role.active).active = true;
        }
        this.setUserSession(this._userSession);
        subscriber.next(this._userSession);
      } catch (error) {
        subscriber.error(error);
      }
      subscriber.complete();
    });
  }
  createAccount(username: string, password: string, firstName: string, lastName, dob: Date) {
    return new Observable(subscriber => {
      this.firebaseService.createUserWithEmailAndPassword(username, password).then(() => {
        const user = new User();
        user.email = username;
        user.username = username;
        user.dob = dob;
        user.firstName = firstName;
        user.lastName = lastName;
        this.firebaseService.createNewUserAccount(user).then(() => {
          this.closeActiveLoginSubscription();
          this.loginSubscription = this.login(username, password).subscribe(userSession => {
            subscriber.next(userSession);
          });
        }).catch((error) => {
          subscriber.next(error);
          subscriber.complete();
        });
      }).catch((error) => {
        subscriber.next(error);
        subscriber.complete();
      });
    });
  }
  updateUser(user: User) {
    return new Observable(subscriber => {
      this.firebaseService.updateUserAccount(user).then(() => {
        this.cacheUserSession().subscribe((userSession: UserSession) => {
          subscriber.next(userSession);
          this.setUserSession(userSession);
          subscriber.complete();
        }, error => {
          subscriber.error(error);
          subscriber.complete();
        });
      }).catch(error => {
        subscriber.error(error);
        subscriber.complete();
      });
    });
  }
  cacheUserSession() {
    return new Observable(subscriber => {
      this.firebaseService.getUserAccount(this._user.username).subscribe(user => {

        localStorage.removeItem('CFBlocks');
        const userSession = new UserSession();
        userSession.created = new Date();
        userSession.lastLogin = userSession.created;
        userSession.authenticated = true;
        userSession.user = user as User;
        localStorage.setItem('CFBlocks', JSON.stringify(userSession));

        this.setUserSession(userSession);
        subscriber.next(userSession);
        subscriber.complete();
      }, error => {
        subscriber.error(error);
        subscriber.complete();
      });
    });
  }
  private closeActiveLoginSubscription() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
  getFormatedName() {
    if (this._user) {
      if (this._user.firstName && this._user.lastName) {
        return `${this._user.firstName} ${this._user.lastName}`;
      } else if (this._user.firstName) {
        return this._user.firstName;
      } else if (this._user.username) {
        return this._user.username;
      } else {
        return 'Guest';
      }
    } else {
      return 'Guest';
    }
  }
}
