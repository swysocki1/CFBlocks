import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {mergeUser, User, UserSession} from '../../../../models/user.model';
import {LoginService} from '../../../../services/login.service';
import {ValidationService} from '../../../../services/validation.service';
import * as moment from 'moment';

@Component({
  selector: 'user-block-template',
  templateUrl: 'blockTemplate.html'
})
export class UserBlockTemplateComponent implements OnInit, OnChanges {
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
  loadUserToForm(user?: User) {
    if (!user) {
      user = new User();
      if (this.user) {
        user = {...this.user} as User;
      }
    }
    this.form = this.fb.group({
      carbs: [user.blockTemplate.carbs, Validators.required],
      fats: [user.blockTemplate.fats, Validators.required],
      protein: [user.blockTemplate.protein, Validators.required],
      metric: [user.blockTemplate.metric, Validators.required]
    });
    if (this.user) {
      this.vs.validateAllFormFields(this.form);
    }
  }
  onSubmit() {
    if (this.form.valid) {
      const user: User = new User();
      // user.email = this.form.value.email; // TODO lets not update email YET
      user.blockTemplate.carbs = this.form.value.carbs;
      user.blockTemplate.fats = this.form.value.fats;
      user.blockTemplate.protein = this.form.value.protein;
      user.blockTemplate.metric = this.form.value.metric;
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
  setDefaults() {
    const user = new User();
    user.blockTemplate.metric = 'Zone Block';;
    user.blockTemplate.carbs = 9;
    user.blockTemplate.fats = 1.5;
    user.blockTemplate.protein = 7;
    this.loadUserToForm(user);
  }
  defaultIsNotSet(): boolean {
    return !(this.form.value.metric === 'Zone Block' &&
      this.form.value.carbs === 9 &&
      this.form.value.fats === 1.5 &&
      this.form.value.protein === 7);
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
