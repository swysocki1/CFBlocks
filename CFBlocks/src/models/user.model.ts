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
  photoURL: string;
  favFoods?: [string] = [] as [string];
}
export function mergeUser(oldUser: User, newUser: User): User {
  // oldUser.email = isBlank(newUser.email) ? isBlank(newUser.email) : oldUser.email;
  oldUser.firstName = isBlank(newUser.firstName) ? isBlank(newUser.firstName) : oldUser.firstName;
  oldUser.lastName = isBlank(newUser.lastName) ? isBlank(newUser.lastName) : oldUser.lastName;
  oldUser.dob = newUser.dob ? newUser.dob : oldUser.dob; // TODO Date fix
  oldUser.sex = isBlank(newUser.sex) ? isBlank(newUser.sex) : oldUser.sex;
  if (!oldUser.body) { oldUser.body = new UserBody(); }
  if (!oldUser.body.bodyWeight) { oldUser.body.bodyWeight = new BodyWeight(); }
  if (!oldUser.body.lbm) { oldUser.body.lbm = new BodyWeight(); }
  oldUser.body.bodyWeight.weight = newUser.body.bodyWeight.weight ?
    newUser.body.bodyWeight.weight : oldUser.body.bodyWeight.weight;
  oldUser.body.bodyWeight.metric = isBlank(newUser.body.bodyWeight.metric) ?
    isBlank(newUser.body.bodyWeight.metric) : oldUser.body.bodyWeight.metric;
  oldUser.body.lbm.weight = newUser.body.lbm.weight ? newUser.body.lbm.weight : oldUser.body.lbm.weight;
  oldUser.body.lbm.metric = isBlank(newUser.body.lbm.metric) ? isBlank(newUser.body.lbm.metric) : oldUser.body.lbm.metric;
  if (!oldUser.lifeStyle) { oldUser.lifeStyle = new UserLifeStyle(); }
  oldUser.lifeStyle.activityLevel = isBlank(newUser.lifeStyle.activityLevel) ?
    isBlank(newUser.lifeStyle.activityLevel) : oldUser.lifeStyle.activityLevel;
  oldUser.lifeStyle.fitnessGoal = isBlank(newUser.lifeStyle.fitnessGoal) ?
    isBlank(newUser.lifeStyle.fitnessGoal) : oldUser.lifeStyle.fitnessGoal;
  if (!oldUser.blockTemplate) { oldUser.blockTemplate = new BlockTemplate(); }
  oldUser.blockTemplate.metric = isBlank(newUser.blockTemplate.metric) ?
    isBlank(newUser.blockTemplate.metric) : oldUser.blockTemplate.metric;
  oldUser.blockTemplate.carbs = newUser.blockTemplate.carbs ? newUser.blockTemplate.carbs : oldUser.blockTemplate.carbs;
  oldUser.blockTemplate.fats = newUser.blockTemplate.fats ? newUser.blockTemplate.fats : oldUser.blockTemplate.fats;
  oldUser.blockTemplate.protein = newUser.blockTemplate.protein ? newUser.blockTemplate.protein : oldUser.blockTemplate.protein;
  oldUser.favFoods = newUser.favFoods && newUser.favFoods.length ? newUser.favFoods : oldUser.favFoods;
  return oldUser;
}
export function isBlank(value: string): string {
  if (value && value.trim()) {
    return value.trim();
  }
  return '';
}
export class UserBody {
  bodyWeight: BodyWeight = new BodyWeight();
  lbm: BodyWeight = new BodyWeight();
}
export class BodyWeight {
  weight: number;
  metric = 'pounds';
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
    if (this.isEmail(this.username)) {
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
  isEmail(email: any) {
    if(email && typeof email === 'string') {
      const re = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-]){0,}@[a-zA-Z0-9-]+\.([a-zA-Z]{1,6}\.)?[a-zA-Z]{2,6}$/;
      return re.test(String(email).toLowerCase());
    } else {
      return false;
    }
  }
}
