/**
 * Created by swysocki on 5/10/18.
 */

import {Injectable} from '@angular/core';
import {User, UserSession} from '../models/user.model';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class LoginService {
  private _user: User = new User();
  private _userSession: UserSession = new UserSession();
  getUser(): User {
    return this._user;
  }

  private setUser(value: User) {
    this._user = value;
  }

  getUserSession(): UserSession {
    return this._userSession;
  }

  private setUserSession(value: UserSession) {
    this._userSession = value;
    if (value) {
      this.setUser(value.user);
    }
  }

  constructor() {
    const cachedSession: UserSession = JSON.parse(localStorage.getItem('CFBlocks'));
    if (cachedSession && cachedSession.user.username && cachedSession.lastLogin &&
      moment(cachedSession.lastLogin).isSameOrAfter(moment().subtract(1, 'days'))) {
      this.setUserSession(cachedSession);
    }
  }

  // isLogedIn(): boolean {
  //   return this._userSession ? true : false;
  // }
  login(username: string, password: string): Observable<UserSession> {
    return new Observable(subscriber => {
      const cachedSession: UserSession = JSON.parse(localStorage.getItem('CFBlocks'));
      if (cachedSession && cachedSession.user.username === username && cachedSession.lastLogin &&
        moment(cachedSession.lastLogin).isSameOrAfter(moment().subtract(1, 'days'))) {
        subscriber.next(cachedSession);
        subscriber.complete();
      } else if (cachedSession) {
        localStorage.removeItem('CFBlocks');
      }

      // TODO auth user and cache

      const userSession = new UserSession();
      userSession.setTestUser(); // Setting test user // Needs to be deleted


      localStorage.setItem('CFBlocks', JSON.stringify(userSession));
      this.setUserSession(userSession);

      subscriber.next(userSession);
      subscriber.complete();
    });
  }
  logout(): Observable<UserSession> {
    return new Observable(subscriber => {
      console.log('loggingOut');
      localStorage.removeItem('CFBlocks');
      this.setUserSession(null);
      subscriber.next(this.getUserSession());
      subscriber.complete();

      // TODO error on logging out
    });
  }
  hasAdmin() {
    if (this._userSession && this._userSession.user && this._userSession.user.roles) {
      const userRoles = this._userSession.user.roles;
      return userRoles.some(role => role.type === 'ADMIN');
    } else {
      return false;
    }
  }
  isAdmin(): boolean {
    if (this.hasAdmin()) {
      if (this._userSession && this._userSession.user && this._userSession.user.roles) {
        const userRoles = this._userSession.user.roles;
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
          this._userSession.user.roles.find(role => role.type === 'ADMIN' && role.active).active = false;
        } else if (this.hasAdmin()) {
          this._userSession.user.roles.find(role => role.type === 'ADMIN' && !role.active).active = true;
        }
        this.setUserSession(this._userSession);
        subscriber.next(this._userSession);
      } catch(error) {
        subscriber.error(error);
      }
      subscriber.complete()
    });
  }
}
