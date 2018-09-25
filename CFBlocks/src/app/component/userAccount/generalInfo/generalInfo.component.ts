import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {mergeUser, User, UserSession} from '../../../../models/user.model';
import {LoginService} from '../../../../services/login.service';

@Component({
  selector: 'user-general-info',
  templateUrl: 'generalInfo.html'
})
export class UserGeneralInfoComponent implements OnInit, OnChanges {
  @Input() user: User;
  @Input() updateActive: boolean;
  @Input() fieldSetName: string;
  @Output() toggleUpdateActive = new EventEmitter<string>();
  @Output() updateUser = new EventEmitter<User>();

  displayTimeout = 5000;
  displaySuccess = false;
  displayError = false;
  displayErrorMessage = '';
// https://loiane.com/2017/08/angular-reactive-forms-trigger-validation-on-submit/
  constructor(private ls: LoginService, private fb: FormBuilder) {}
  form: FormGroup;
  ngOnInit() {
    this.loadUserToForm();
  }
  loadUserToForm() {
    this.resetDisplayMessages();
    let user  = new User();
    if (this.user) {
      user = {... this.user} as User;
    }
    this.form = this.fb.group({
      email: [user.email, Validators.required],
      firstName: [user.firstName, Validators.required],
      lastName: [user.lastName, Validators.required],
      dob: [user.dob, Validators.required],
      sex: [user.sex, Validators.required]
    });
  }
  onSubmit() {
    if (this.form.valid) {
      const user: User = new User();
      // user.email = this.form.value.email; // TODO lets not update email YET
      user.firstName = this.form.value.firstName;
      user.lastName = this.form.value.lastName;
      user.dob = this.form.value.dob;
      user.sex = this.form.value.sex;
      console.log(this.user);
      console.log(user);
      this.user = mergeUser(this.user, user);
      console.log(this.user);
      this.ls.updateUser(this.user).subscribe((userSession: UserSession) => {
        this.displayUpdateSuccess();
        this.updateUser.emit(userSession.user);
      }, error => {
        this.displayErrorUpdate(error);
      });
    } else {
      this.validateAllFormFields(this.form);
    }
  }
  toggleUpdate() {
    this.toggleUpdateActive.emit(this.fieldSetName);
  }
  reset() {
    this.loadUserToForm();
    this.toggleUpdateActive.emit(null);
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
  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
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
