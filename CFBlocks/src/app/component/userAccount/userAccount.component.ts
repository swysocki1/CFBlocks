import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from '../../../models/user.model';
import {FormControl, FormGroup} from '@angular/forms';
import {UtilService} from '../../../services/util.service';

@Component({
  selector: 'user-account',
  templateUrl: 'userAccount.html'
})
export class UserAccountComponent {
  @Input() userAccount: User;
  @Output() userAccountUpdate: EventEmitter<User> = new EventEmitter<User>();

  constructor(private util: UtilService) {}

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
    blackMetric: new FormControl(),
    carbs: new FormControl(),
    fats: new FormControl(),
    protein: new FormControl(),
  });

  onSubmit() {
    this.userAccount.merge(this.buildUserObj(this.accountInfo.value));
    this.userAccountUpdate.emit(this.userAccount);
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
}
