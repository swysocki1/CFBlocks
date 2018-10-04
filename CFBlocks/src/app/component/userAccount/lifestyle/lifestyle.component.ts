import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BodyWeight, mergeUser, User, UserSession} from '../../../../models/user.model';
import {LoginService} from '../../../../services/login.service';
import {ValidationService} from '../../../../services/validation.service';

@Component({
  selector: 'user-lifestyle',
  templateUrl: 'lifestyle.html'
})
export class UserLifeStyleComponent implements OnInit, OnChanges {
  @Input() user: User;
  @Input() updateActive: boolean;
  @Input() fieldSetName: string;
  @Output() toggleUpdateActive = new EventEmitter<string>();
  @Output() updateUser = new EventEmitter<User>();
// https://loiane.com/2017/08/angular-reactive-forms-trigger-validation-on-submit/
  constructor(private ls: LoginService, private fb: FormBuilder, private vs: ValidationService) {}
  form: FormGroup;
  ngOnInit() {
    this.loadUserToForm();
  }
  loadUserToForm() {
    let user  = new User();
    if (this.user) {
      user = {... this.user} as User;
    }
    this.form = this.fb.group({
      fitnessGoal: [user.lifeStyle.fitnessGoal],
      activityLevel: [user.lifeStyle.activityLevel]
    });
    if (this.user) {
      this.vs.validateAllFormFields(this.form);
    }
  }
  onSubmit() {
    if (this.form.valid) {
      const user: User = new User();
      // user.email = this.form.value.email; // TODO lets not update email YET
      user.lifeStyle.fitnessGoal= this.form.value.fitnessGoal;
      user.lifeStyle.activityLevel = this.form.value.activityLevel;
      this.user = mergeUser(this.user, user);
      this.ls.updateUser(this.user).subscribe((userSession: UserSession) => {
        this.updateUser.emit(userSession.user);
      }, error => {
        console.error(error);
      });
    } else {
      this.vs.validateAllFormFields(this.form);
    }
  }
  toggleUpdate() {
    this.toggleUpdateActive.emit(this.fieldSetName);
  }
  reset() {
    this.loadUserToForm();
    this.toggleUpdateActive.emit(null);
  }
  isFieldInvalid(field: string) {
    return this.vs.isFieldInvalid(this.form, field);
  }
  isFieldValid(field: string) {
    return this.vs.isFieldValid(this.form, field);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.user && changes.user.currentValue !== changes.user.previousValue) {
      this.loadUserToForm();
    }
    if (changes.updateActive && changes.updateActive.currentValue !== changes.updateActive.previousValue) {
      this.loadUserToForm();
    }
  }
}
