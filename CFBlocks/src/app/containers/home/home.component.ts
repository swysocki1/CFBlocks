import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../../services/login.service';
import {User, UserSession} from '../../../models/user.model';
import {Router} from '@angular/router';

@Component({
  templateUrl: './home.html',
  styles: [`
    .home-page { }
    .main-title {
      font-size: 45px;
      text-align: left;
      font-family: 'PT Sans', 'Helvetica Nue', arial, sans-serif;
      color: #000;
      font-weight: 600;
    }
    .sub-title {
      font-family: 'PT Sans', 'Helvetica Nue', arial, sans-serif;
      font-size: 20px;
      color: #333;
    }
    .main-heading {
      padding-top: 15vh;
    }
    .start-here {
      padding-top: 15vh;
      padding-bottom: 20vh;
    }
    .start-here .sub-title {
      margin-bottom:20px;
      border-bottom: 3px solid #eee;
      margin-left:110px;
      font-size:2em;
    }
    .start-here a.btn.btn-primary {
      width: 100%;
      font-family: 'PT Sans', 'Helvetica Nue', arial, sans-serif;
      font-size: 2em;
    }
  `]
})
export class HomeComponent {

}
