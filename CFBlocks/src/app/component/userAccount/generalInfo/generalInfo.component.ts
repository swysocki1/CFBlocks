import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {mergeUser, User, UserSession} from '../../../../models/user.model';
import {LoginService} from '../../../../services/login.service';

@Component({
  selector: 'user-general-info',
  templateUrl: 'generalInfo.html'
})
export class UserGeneralInfoComponent implements OnChanges {
  @Input() user: User;
  @Input() updateActive: boolean;
  @Input() fieldSetName: string;
  @Output() toggleUpdateActive = new EventEmitter<string>();
  @Output() updateUser = new EventEmitter<User>();

  displayTimeout = 5000;
  displaySuccess = false;
  displayError = false;
  displayErrorMessage = '';

  constructor(private ls: LoginService) {}
  generalInfo: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    dob: new FormControl(new Date(), Validators.required),
    sex: new FormControl('', Validators.required)
  });
  loadUserToForm() {
    this.resetDisplayMessages();
    if (this.user) {
      const user = {... this.user} as User;
      this.generalInfo.patchValue({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        dob: user.dob,
        sex: user.sex
      });
      console.log(user);
      console.log(this.generalInfo);
      // this.generalInfo.value.email.setValue(user.email);
      // this.generalInfo.value.firstName = user.firstName;
      // this.generalInfo.value.lastName = user.lastName;
      // this.generalInfo.value.dob = user.dob;
      // this.generalInfo.value.sex = user.sex;
    }
  }
  onSubmit() {
    const user: User = new User();
    // user.email = this.generalInfo.value.email; // TODO lets not update email YET
    user.firstName = this.generalInfo.value.firstName;
    user.lastName = this.generalInfo.value.lastName;
    user.dob = this.generalInfo.value.dob;
    user.sex = this.generalInfo.value.sex;
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
  ngOnChanges(changes: SimpleChanges) {
    if (changes.user && changes.user.currentValue !== changes.user.previousValue) {
      this.loadUserToForm();
      this.user = changes.user.currentValue as User;
    }
    if (changes.updateActive && changes.updateActive.currentValue !== changes.updateActive.previousValue) {
      this.loadUserToForm();
    }
  }
}
