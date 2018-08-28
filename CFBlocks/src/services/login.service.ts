/**
 * Created by swysocki on 5/10/18.
 */

import {Injectable} from '@angular/core';
import {User, UserSession} from "../models/user.model";
import * as moment from 'moment';
import {Observable} from "rxjs/Observable";

@Injectable()
export class LoginService {
  private _user: User;
  get user(): User {
    return this._user;
  }
  
  private setUser(value: User) {
    this._user = value;
  }
  
  private _userSession: UserSession;
  get userSession(): UserSession {
    return this._userSession;
  }
  
  private setUserSession(value: UserSession) {
    this._userSession = value;
  }
  
  isLogedIn(): boolean {
    return (this._userSession !== null || this._userSession !== undefined);
  }
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
      
      let testUser = new UserSession();
      testUser.user = new User();
      testUser.user.email = 'swysoc1@students.towson.edu';
      testUser.user.firstName = 'Sean';
      testUser.user.lastName = 'Wysocki';
      testUser.user.username = 'swysoc1@students.towson.edu';
      testUser.created = moment().toDate();
      testUser.lastLogin = moment().toDate();
      
      localStorage.setItem('CFBlocks', JSON.stringify(testUser));
      this._user = testUser.user;
      
      subscriber.next(testUser);
      subscriber.complete();
    });
  }
  logout() {
    localStorage.removeItem('CFBlocks');
    this._user = null;
    this._userSession = null;
  }
}
