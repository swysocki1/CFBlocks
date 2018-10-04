import {Component, OnInit} from '@angular/core';
import {User} from '../../../models/user.model';
import {UtilService} from '../../../services/util.service';
import {LoginService} from '../../../services/login.service';

@Component({
  selector: 'user-account',
  templateUrl: 'userAccount.html'
})
export class UserAccountComponent implements OnInit {
  userAccount: User;
  fieldSet;

  constructor(private util: UtilService, private ls: LoginService) { }
  ngOnInit() {
    this.updateUser(this.ls.getUser() as User);
    this.ls.getUserUpdates.subscribe(update => {
      this.updateUser(update);
    });
  }
  updateUser(user: User) {
    this.userAccount = user;
    this.fieldSet = null;
  }
  toggleFieldSet(fieldSet: string) {
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
}
