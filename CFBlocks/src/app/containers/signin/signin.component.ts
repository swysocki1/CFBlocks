import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../../../services/login.service';
import {ValidationService} from '../../../services/validation.service';
import {LoginCombo, UserSession} from '../../../models/user.model';
import {Observable} from 'rxjs/internal/Observable';
import {Router} from '@angular/router';
declare var $: any;

@Component({
  selector: 'signin',
  templateUrl: './signin.html',
  styles: [ `
    .jumbotron {
      padding-top: 25vh;
      padding-bottom: 30vh;
    }
  `]
})
export class SigninComponent implements OnInit {
  constructor(private ls: LoginService, private vs: ValidationService, private router: Router, private fb: FormBuilder) {}
  login: FormGroup;
  loginError = '';
  ngOnInit() {
    this.loadLoginForm();
  }
  loadLoginForm() {
    this.login = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [true, Validators.required]
    })
  }
  onSubmit() {
    this.loginError = '';
    this.ls.login(this.login.value.username, this.login.value.password, this.login.value.rememberMe).subscribe(userSession => {
      console.log(userSession);
      this.loadUserSession(userSession);
    }, error => {
      this.loadLoginError(error);
    });
  }
  // validateAndLogin(loginCombo: LoginCombo): Observable<UserSession> {
  //   return new Observable(subscriber => {
  //     // const clientValidation = loginCombo.validate(); // TODO Fix client login validation
  //     // if (clientValidation.valid) {
  //     console.log(loginCombo);
  //     if (true) {
  //       this.ls.login(loginCombo.username, loginCombo.password).subscribe(res => {
  //         subscriber.next(res);
  //         subscriber.complete();
  //       }, error => {
  //         subscriber.error(error);
  //         subscriber.complete();
  //       });
  //     } else {
  //       // subscriber.error(clientValidation.message);
  //       subscriber.complete();
  //     }
  //   });
  // }
  goToCreateNewAccount() {
    this.router.navigate(['/signup']);
  }
  loadUserSession(userSession: UserSession) {
    this.router.navigate(['/home']);
  }
  loadLoginError(message: any) {
    console.error(message);
    this.loginError = message.message;
    // TODO
  }
}
