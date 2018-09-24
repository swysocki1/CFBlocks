import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {LoginService} from '../../../services/login.service';
import {ValidationService} from '../../../services/validation.service';
import {LoginCombo, UserSession} from '../../../models/user.model';
import {Observable} from 'rxjs/internal/Observable';
import {Router} from '@angular/router';
declare var $: any;

@Component({
  selector: 'signin',
  templateUrl: './signin.html'
})
export class SigninComponent {
  constructor(private ls: LoginService, private vs: ValidationService, private router: Router) {}
  login: FormGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
    rememberMe: new FormControl() // TODO
  });
  onSubmit() {
    // TODO
    this.validateAndLogin(new LoginCombo(this.login.value.username, this.login.value.password)).subscribe(userSession => {
      this.loadUserSession(userSession);
    }, error => {
      this.loadLoginError(error);
    });
  }
  validateAndLogin(loginCombo: LoginCombo): Observable<UserSession> {
    return new Observable(subscriber => {
      const clientValidation = loginCombo.validate();
      if (clientValidation.valid) {
        this.ls.login(loginCombo.username, loginCombo.password).subscribe(res => {
          subscriber.next(res);
          subscriber.complete();
        }, error => {
          subscriber.error(error);
          subscriber.complete();
        });
      } else {
        subscriber.error(clientValidation.message);
        subscriber.complete();
      }
    });
  }
  loadUserSession(userSession: UserSession) {
    this.router.navigate(['/home']);
  }
  loadLoginError(message: string) {
    // TODO
  }
}
