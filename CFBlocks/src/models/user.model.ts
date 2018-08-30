import {ValidationService} from "../services/validation.service";


export class User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: [Role] = [] as [Role];
  // TODO add more User Info
}

export class Role {
  id: string;
  type: string;
  permissions: [Permission] = [] as [Permission];
  lastUpdated: Date = new Date();
  updatedBy: string; // User 'id'
  active: boolean;
}

export class Permission {
  id: string;
  permission: string;
}

export class UserSession {
  user: User = new User();
  lastLogin: Date;
  created: Date;
  userAgent: string = navigator.userAgent;
  authenticated: boolean;
  
  setTestUser() {
    this.user.id = 'abc123';
    this.user = new User();
    this.user.email = 'swysoc1@students.towson.edu';
    this.user.firstName = 'Sean';
    this.user.lastName = 'Wysocki';
    this.user.username = 'swysoc1@students.towson.edu';
    this.created = new Date();
    this.lastLogin = new Date();
    this.authenticated = true;
    
    let adminRole = new Role();
    adminRole.active = true;
    adminRole.type = 'ADMIN';
    adminRole.id = '123';
    adminRole.lastUpdated = new Date();
    adminRole.updatedBy = this.user.id;
    let permission = new Permission();
    permission.id = 'xyz';
    permission.permission = 'system-settings';
    adminRole.permissions.push(permission);
    this.user.roles.push(adminRole);
  }
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
