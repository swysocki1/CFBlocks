import {Component} from "@angular/core";
import {LoginService} from "../../services/login.service";
import {LoginCombo, UserSession} from "../../models/user.model";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ValidationService} from "../../services/validation.service";

@Component({
  selector: 'navbar',
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">CF Blocks</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Dropdown
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="#">Action</a>
              <a class="dropdown-item" href="#">Another action</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">Something else here</a>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled" href="#">Disabled</a>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0"  [formGroup]="search" (ngSubmit)="onSearch()">
          <input class="form-control mr-sm-2" type="search" formControlName="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
        <ul class="nav navbar-nav flex-row justify-content-between ml-auto">
          <li class="nav-item order-2 order-md-1"><a href="#" class="nav-link" title="settings"><i class="fa fa-cog fa-fw fa-lg"></i></a></li>
          <li class="dropdown order-1" *ngIf="!(userSession?.user?.username)">
            <button type="button" id="dropdown-login" data-toggle="dropdown" class="btn btn-outline-secondary dropdown-toggle">Login <span class="caret"></span></button>
            <ul class="dropdown-menu dropdown-menu-right mt-2">
              <li class="px-3 py-2">
                <form class="form" role="form" [formGroup]="login" (ngSubmit)="onLogin()">
                  <div class="text-error" id="login-error" *ngIf="loginErrorMessage">{{loginErrorMessage}}</div>
                  <div class="form-group">
                    <input id="usernameInput" formControlName="username" placeholder="Email" class="form-control form-control-sm" type="text" required="">
                  </div>
                  <div class="form-group">
                    <input id="passwordInput" formControlName="password" placeholder="Password" class="form-control form-control-sm" type="text" required="">
                  </div>
                  <div class="form-group">
                    <button type="submit" class="btn btn-primary btn-block">Login</button>
                  </div>
                  <div class="form-group text-center">
                    <small><a href="#" data-toggle="modal" data-target="#modalPassword">Forgot password?</a></small>
                  </div>
                </form>
              </li>
            </ul>
          </li>
          <li class="dropdown order-1" *ngIf="userSession?.user?.username">
            <button type="button" id="dropdown-user-session-nav" data-toggle="dropdown" class="btn btn-outline-secondary dropdown-toggle">{{userSession?.user?.username}} <span class="caret"></span></button>
            <ul class="dropdown-menu dropdown-menu-right mt-2">
              <li class="px-3 py-2">Preferences</li>
              <li class="px-2"><hr style="margin-top:-1px;margin-bottom:-1px;"/></li>
              <li class="px-3 py-2" (click)="logout()">Logout</li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>`
})
export class NavbarComponent {
  userSession: UserSession;
  loginErrorMessage: string;
  login: FormGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });
  search: FormGroup = new FormGroup({
    search: new FormControl()
  });
  constructor(private loginService: LoginService, private valid: ValidationService){
    this.userSession = this.loginService.getUserSession();
  }
  
  private resetLoginFormGroup() {
    this.login = new FormGroup({
      username: new FormControl(),
      password: new FormControl()
    })
  }
  
  onSearch() {
  
  }
  
  onLogin() {
    this.loginErrorMessage = null;
    console.log(this.login);
    let loginCombo = new LoginCombo(this.valid, this.login.value['username'], this.login.value['password']);
    const validateLogin = loginCombo.validate();
    if (validateLogin){
      if (validateLogin.valid) {
        this.loginService.login(loginCombo.username, loginCombo.password).subscribe(userSession => {
          this.userSession = userSession;
          // Navigate to page???
        }, error => {
          console.error(error);
        });
      } else {
        this.loginErrorMessage = validateLogin.message;
      }
    } else {
      console.error('validate Login returned nothing');
    }
  }
  
  logout() {
    this.loginService.logout().subscribe(userSession => {
      this.userSession = userSession;
      // TODO navigate to logout page
    }, error => {
      console.error(error);
    });
  }
}
