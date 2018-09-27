import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../../services/login.service';
import {User} from '../../../models/user.model';

@Component({
  templateUrl: './meal-calendar.html'
})
export class MealCalendarComponent implements OnInit {
  user: User = new User();
  view: string = 'Monthly Meal Plan';
  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.user = this.loginService.getUser();
    this.loginService.getUserUpdates.subscribe(update => {
      this.user = update;
    });
  }
  getFormatedName() {
    return this.loginService.getFormatedName();
  }
}
