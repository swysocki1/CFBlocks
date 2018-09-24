import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from '../../../models/user.model';
import {FormControl, FormGroup} from '@angular/forms';
import {UtilService} from '../../../services/util.service';
import {LoginService} from '../../../services/login.service';

@Component({
  selector: 'user-account',
  templateUrl: 'userAccount.html'
})
export class UserAccountComponent {
  userAccount: User;
  displayTimeout = 5000;
  displaySuccess = false;
  displayError = false;
  displayErrorMessage = '';
  fieldSet;
  // @Output() userAccountUpdate: EventEmitter<User> = new EventEmitter<User>();

  constructor(private util: UtilService, private ls: LoginService) {
    this.userAccount = this.ls.getUser();
    this.loadForm(this.userAccount);
  }

  accountInfo: FormGroup = new FormGroup({
    email: new FormControl(),
    firstName: new FormControl(),
    lastName: new FormControl(),
    dob: new FormControl(),
    sex: new FormControl(),
    bodyweight: new FormControl(),
    bodyWeightMetric: new FormControl(),
    lbm: new FormControl(),
    lbmMetric: new FormControl(),
    activityLevel: new FormControl(),
    fitnessGoal: new FormControl(),
    blockMetric: new FormControl(),
    carbs: new FormControl(),
    fats: new FormControl(),
    protein: new FormControl(),
  });

  onSubmit() {
    this.resetDisplayMessages();
    this.userAccount.merge(this.buildUserObj(this.accountInfo.value));
    this.ls.updateUser(this.userAccount).then(() => {
      this.displayUpdateSuccess();
    }).catch(error => {
      this.displayErrorUpdate(error);
    });
  }
  reset() {
    this.fieldSet = null;
    this.loadForm(this.userAccount);
  }
  loadForm(user: User) {
    this.accountInfo.value.email = user.email;
    this.accountInfo.value.firstName = user.firstName;
    this.accountInfo.value.lastName = user.lastName;
    this.accountInfo.value.dob = user.dob;
    this.accountInfo.value.sex = user.sex;
    this.accountInfo.value.bodyWeight = user.body.bodyWeight.weight;
    this.accountInfo.value.bodyWeightMetric = user.body.bodyWeight.metric;
    this.accountInfo.value.lbm = user.body.lbm.weight;
    this.accountInfo.value.lbmMetric = user.body.lbm.metric;
    this.accountInfo.value.activityLevel = user.lifeStyle.activityLevel;
    this.accountInfo.value.fitnessGoal = user.lifeStyle.fitnessGoal;
    this.accountInfo.value.blockMetric = user.blockTemplate.metric;
    this.accountInfo.value.carbs = user.blockTemplate.carbs;
    this.accountInfo.value.fats = user.blockTemplate.fats;
    this.accountInfo.value.protein = user.blockTemplate.protein;
  }
  buildUserObj(accountInfo): User {
    const user = new User();
    user.email = this.util.isBlank(accountInfo.email);
    user.firstName = this.util.isBlank(accountInfo.firstName);
    user.lastName = this.util.isBlank(accountInfo.lastName);
    user.dob = this.util.isBlank(accountInfo.dob);
    user.sex = this.util.isBlank(accountInfo.sex);
    user.body.bodyWeight.weight = this.util.isBlank(accountInfo.bodyWeight);
    user.body.bodyWeight.metric = this.util.isBlank(accountInfo.bodyWeightMetric);
    user.body.lbm.weight = this.util.isBlank(accountInfo.lbm);
    user.body.lbm.metric = this.util.isBlank(accountInfo.lbmMetric);
    user.lifeStyle.activityLevel = this.util.isBlank(accountInfo.activityLevel);
    user.lifeStyle.fitnessGoal = this.util.isBlank(accountInfo.fitnessGoal);
    user.blockTemplate.metric = this.util.isBlank(accountInfo.blockMetric);
    user.blockTemplate.carbs = this.util.isBlank(accountInfo.carbs);
    user.blockTemplate.fats = this.util.isBlank(accountInfo.fats);
    user.blockTemplate.protein = this.util.isBlank(accountInfo.protein);
    return user;
  }
  toggleFieldSet(fieldSet: string) {
    this.reset();
    if (this.fieldSet && this.fieldSet === fieldSet) {
      this.fieldSet = null;
    } else {
      this.fieldSet = fieldSet;
    }
  }
  fieldSetActive(fieldSet: string) {
    if (this.fieldSet) {
      return this.fieldSet === fieldSet;
    } else {
      return false;
    }
  }
  resetDisplayMessages() {
    this.displaySuccess = false;
    this.displayError = false;
    this.displayErrorMessage = '';
  }
  displayUpdateSuccess() {
    this.displaySuccess = true;
    setTimeout(() => {
      this.displaySuccess = false;
    }, this.displayTimeout);
  }
  displayErrorUpdate(message: string) {
    this.displayError = true;
    this.displayErrorMessage = message;
  }
}
