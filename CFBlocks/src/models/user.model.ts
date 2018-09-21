import {ValidationService} from '../services/validation.service';
import {BlockTemplate} from './meal.module';

export class User {
  id?: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: Date;
  sex: string;
  body: UserBody = new UserBody();
  lifeStyle: UserLifeStyle = new UserLifeStyle();
  blockTemplate: BlockTemplate = new BlockTemplate();
  merge(newUser: User): void {
    this.email = this.isBlank(newUser.email) ? this.isBlank(newUser.email) : this.email;
    this.firstName = this.isBlank(newUser.firstName) ? this.isBlank(newUser.firstName) : this.firstName;
    this.lastName = this.isBlank(newUser.lastName) ? this.isBlank(newUser.lastName) : this.lastName;
    this.dob = newUser.dob ? newUser.dob : this.dob; // TODO Date fix
    this.sex = this.isBlank(newUser.sex) ? this.isBlank(newUser.sex) : this.sex;
    if (!this.body) { this.body = new UserBody(); }
    if (!this.body.bodyWeight) { this.body.bodyWeight = new BodyWeight(); }
    if (!this.body.lbm) { this.body.lbm = new BodyWeight(); }
    this.body.bodyWeight.weight = newUser.body.bodyWeight.weight ?
      newUser.body.bodyWeight.weight : this.body.bodyWeight.weight;
    this.body.bodyWeight.metric = this.isBlank(newUser.body.bodyWeight.metric) ?
      this.isBlank(newUser.body.bodyWeight.metric) : this.body.bodyWeight.metric;
    this.body.lbm.weight = newUser.body.lbm.weight ? newUser.body.lbm.weight : this.body.lbm.weight;
    this.body.lbm.metric = this.isBlank(newUser.body.lbm.metric) ? this.isBlank(newUser.body.lbm.metric) : this.body.lbm.metric;
    if (!this.lifeStyle) { this.lifeStyle = new UserLifeStyle(); }
    this.lifeStyle.activityLevel = this.isBlank(newUser.lifeStyle.activityLevel) ?
      this.isBlank(newUser.lifeStyle.activityLevel) : this.lifeStyle.activityLevel;
    this.lifeStyle.fitnessGoal = this.isBlank(newUser.lifeStyle.fitnessGoal) ?
      this.isBlank(newUser.lifeStyle.fitnessGoal) : this.lifeStyle.fitnessGoal;
    if (!this.blockTemplate) { this.blockTemplate = new BlockTemplate(); }
    this.blockTemplate.metric = this.isBlank(newUser.blockTemplate.metric) ?
      this.isBlank(newUser.blockTemplate.metric) : this.blockTemplate.metric;
    this.blockTemplate.carbs = newUser.blockTemplate.carbs ? newUser.blockTemplate.carbs : this.blockTemplate.carbs;
    this.blockTemplate.fats = newUser.blockTemplate.fats ? newUser.blockTemplate.fats : this.blockTemplate.fats;
    this.blockTemplate.protein = newUser.blockTemplate.protein ? newUser.blockTemplate.protein : this.blockTemplate.protein;
  }
  private isBlank(value: string): string {
    if (value && value.trim()) {
      return value.trim();
    }
    return '';
  }
}
export class UserBody {
  bodyWeight: BodyWeight = new BodyWeight();
  lbm: BodyWeight = new BodyWeight();
}
export class BodyWeight {
  weight: number;
  metric: string;
}
export class UserLifeStyle {
  activityLevel: string;
  fitnessGoal: string;
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
  roles: [Role] = [] as [Role];

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

    const adminRole = new Role();
    adminRole.active = true;
    adminRole.type = 'ADMIN';
    adminRole.id = '123';
    adminRole.lastUpdated = new Date();
    adminRole.updatedBy = this.user.id;
    const permission = new Permission();
    permission.id = 'xyz';
    permission.permission = 'system-settings';
    adminRole.permissions.push(permission);
    this.roles.push(adminRole);
  }
}

export class LoginCombo {
  username: string;
  password: string;
  constructor(private vs: ValidationService, username?: string, password?: string) {
    if (username) {
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
