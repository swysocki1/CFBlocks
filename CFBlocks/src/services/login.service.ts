/**
 * Created by swysocki on 5/10/18.
 */

import {Injectable} from '@angular/core';
import {User, UserSession} from "../models/user.model";
import * as moment from 'moment';
import {Observable} from "rxjs/Observable";

@Injectable()
export class LoginService {
  private _user: User = new User();
  getUser(): User {
    return this._user;
  }
  
  private setUser(value: User) {
    this._user = value;
  }
  
  private _userSession: UserSession = new UserSession();
  getUserSession(): UserSession {
    return this._userSession;
  }
  
  private setUserSession(value: UserSession) {
    this._userSession = value;
    if (value)
      this.setUser(value.user);
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
      
      let userSession = new UserSession();
      userSession.user = new User();
      userSession.user.email = 'swysoc1@students.towson.edu';
      userSession.user.firstName = 'Sean';
      userSession.user.lastName = 'Wysocki';
      userSession.user.username = 'swysoc1@students.towson.edu';
      userSession.created = moment().toDate();
      userSession.lastLogin = moment().toDate();
      
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
}
