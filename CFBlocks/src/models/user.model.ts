import {ValidationService} from "../services/validation.service";

export class User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  // TODO add more User Info
}

export class UserSession {
  user: User;
  lastLogin: Date;
  created: Date;
  userAgent: string;
}

export class LoginCombo {
  username: string;
  password: string;
  constructor(private vs: ValidationService, username?: string, password?: string) {
    if(username) {
      this.username = username;
    }
    if (password) {
      this.password = password;
    }
  }
  validate(): {valid: boolean, message?: string} { // TODO better login error messages
    let valid;
    let message;
    if (this.vs.isEmail(this.username)) {
      const passwordStrength = this.vs.passwordStrength(this.password).toUpperCase();
      if (passwordStrength !== 'WEAK') {
        valid = true;
      } else {
        valid = false;
        message = `${passwordStrength} Password. ${this.vs.passwordQualifications}!` ;
      }
    } else {
      valid = false;
      message = `Invalid Email!` ;
    }
    return {valid: valid, message: message};
  }
}
