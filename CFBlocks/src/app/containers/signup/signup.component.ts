import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {LoginService} from '../../../services/login.service';
import {ValidationService} from '../../../services/validation.service';
import {UserSession} from '../../../models/user.model';
import {Router} from '@angular/router';
declare var $: any;

@Component({
  selector: 'signup-modal',
  templateUrl: './signup.html'
})
export class SignupComponent {
  constructor(private ls: LoginService, private vs: ValidationService, private router: Router) {}
  account: FormGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
    password2: new FormControl()
  });
  errors = {};
  passwordHidden = true;
  @Output() updateUserSession = new EventEmitter<UserSession>();
  onSubmit() {
    // TODO
    this.errors = this.validate(this.account.value);
    if (Object.keys(this.errors).length === 0) {
      this.ls.createAccount(this.account.value.username, this.account.value.password).subscribe((userSession: UserSession) => {
        $('#signup-modal').modal('hide');
        this.updateUserSession.emit(userSession);
        this.router.navigate(['/updateAccount']);
        // TODO go to New User Signup Flow
      }, error => {
        console.error(error);
      });
    } else {
      console.error(this.errors);
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
