import {Component, EventEmitter, OnInit} from '@angular/core';
import {LoginService} from '../../services/login.service';
import {LoginCombo, User, UserSession} from '../../models/user.model';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ValidationService} from '../../services/validation.service';
import {NavbarSearchService} from './navbar-search.service';
import {NotificationService} from '../../services/notification.service';
import {Notification} from '../../models/notification.model';
import {Router} from '@angular/router';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.html',
  styles: [`
    .external-link-container {
      background-color: #666;
      min-height: 40px;
    }
    .external-link-container a,
    .external-link-container button.btn.btn-link {
      color: #ccc;
    }
    .external-link-container a:hover,
    .external-link-container button.btn.btn-link:hover {
      color: #000;
    }
    .user-session-container {
      background-color: #ff5050;
      min-height: 40px;
    }
    .user-session-container a,
    .user-session-container button.btn.btn-link {
      color: #fff;
    }
    .user-session-container a:hover,
    .user-session-container button.btn.btn-link:hover {
      color: #000;
    }
  `]
})
export class NavbarComponent implements OnInit {
  notifications = [] as [Notification];
  userSession: UserSession;
  userSessionChange: EventEmitter<UserSession> = new EventEmitter<UserSession>();
  loginErrorMessage: string;
  login: FormGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });
  search: FormGroup = new FormGroup({
    search: new FormControl()
  });
  constructor(private loginService: LoginService, private valid: ValidationService, private searchService: NavbarSearchService,
              private notificationService: NotificationService, private router: Router) { }

  ngOnInit() {
    this.loginService.getUserSession();
    this.updateUserSession(this.loginService.getUserSession());
    this.loginService.getUserSessionUpdates.subscribe(update => {
      this.updateUserSession(update);
    });
    this.notificationService.getNotifications(this.userSession.user).subscribe(notifications => {
      this.notifications.push(notifications);
    });
  }
  private updateUserSession(userSession: UserSession) {
    this.userSession = userSession;
    this.userSessionChange.emit(this.userSession);
  }

  private resetLoginFormGroup() {
    this.login = new FormGroup({
      username: new FormControl(),
      password: new FormControl()
    })
  }

  onSearch() {
    if (this.search && this.search.value && this.search.value['search'] && this.search.value['search'].trim()) {
      const searchResult = this.searchService.search(this.search.value['search'].trim());
      // TODO something needs to be done with search results
    }
  }

  onLogin() {
    this.loginErrorMessage = null;
    const loginCombo = new LoginCombo(this.valid, this.login.value['username'], this.login.value['password']);
    const validateLogin = loginCombo.validate();
    if (validateLogin){
      if (validateLogin.valid) {
        this.loginService.login(loginCombo.username, loginCombo.password).subscribe(userSession => {
          this.updateUserSession(userSession);
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
  isLogedIn() {
    return !!(this.userSession && this.userSession.user && this.userSession.user.username && this.userSession.user.username.trim());
  }
  toggleAdmin(): void {
    this.loginService.toggleAdmin().subscribe(userSession => {
      this.updateUserSession(userSession);
    });
  }
  hasAdmin(): boolean {
    return this.loginService.hasAdmin();
  }
  isAdmin(): boolean {
    return this.loginService.isAdmin();
  }
  atLoginPage() {
    return this.router.url === '/signin' || this.router.url === '/signup';
  }
}
