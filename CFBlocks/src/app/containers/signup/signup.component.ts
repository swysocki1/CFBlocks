import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../../../services/login.service';
import {ValidationService} from '../../../services/validation.service';
import {UserSession} from '../../../models/user.model';
import {Router} from '@angular/router';
declare var $: any;

@Component({
  selector: 'signup',
  templateUrl: './signup.html',
  styles: [ `
    .jumbotron {
      padding-top: 25vh;
      padding-bottom: 30vh;
    }
  `]
})
export class SignupComponent implements OnInit {
  constructor(private ls: LoginService, private vs: ValidationService, private router: Router, private fb: FormBuilder) {}
  account: FormGroup = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    dob: new FormControl(),
    username: new FormControl(),
    password: new FormControl(),
    password2: new FormControl()
  });
  errorMessage = '';
  passwordHidden = true;
  ngOnInit() {
    this.loadForm();
  }
  loadForm() {
    this.account = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required]
    });
  }
  onSubmit() {
    // TODO
    // this.errors = this.validate(this.account.value);
    // if (Object.keys(this.errors).length === 0) {
    this.errorMessage = '';
    if (this.account.value.password === this.account.value.password2) {
      this.ls.createAccount(this.account.value.username, this.account.value.password, this.account.value.firstName,
        this.account.value.lastName, this.account.value.dob).subscribe((userSession: UserSession) => {
        this.router.navigate(['/block-calculator']);
        // TODO go to New User Signup Flow
      }, error => {
        console.error(error);
        this.errorMessage = error.message;
      });
    } else {
      this.errorMessage = 'Both Password Fields MUST Match!';
    }
  }
  validate(accountSignUp: AccountSignUp): any {
    const res = {};
    if (!this.vs.isEmail(accountSignUp.username)) {
      res['username'] = `Username Must be a valid Email.`;
    } else if (this.vs.usernameExists(accountSignUp.username)) {
      res['username'] = `Username Already Exists!`;
    }
    if (accountSignUp.password !== accountSignUp.password2) {
      res['password'] = `Passwords do not match.`;
    } else if (this.vs.passwordStrength(accountSignUp.password) === 'WEAK') {
      res['password'] = `Passwords is Weak. ` + this.vs.passwordQualifications;
    }
    return res;
  }
  getPasswordType() {
    return this.passwordHidden ? 'password' : 'text';
  }
  togglePasswordHide(): void {
    this.passwordHidden = !this.passwordHidden;
  }
}
export class AccountSignUp {
  username: string;
  password: string;
  password2: string;
}
