import {Component, EventEmitter, OnInit} from '@angular/core';
import {LoginService} from '../../services/login.service';
import {LoginCombo, User, UserSession} from '../../models/user.model';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ValidationService} from '../../services/validation.service';
import {NavbarSearchService} from './navbar-search.service';
import {NotificationService} from '../../services/notification.service';
import {Notification} from '../../models/notification.model';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
declare var $: any;

@Component({
  selector: 'navbar',
  templateUrl: './navbar.html'
})
export class NavbarComponent implements OnInit {
  facebook: string = environment.facebook;
  twitter: string = environment.twitter;
  youtube: string = environment.youtube;
  instagram: string = environment.instagram;
  notifications = [] as [Notification];
  userSession: UserSession;
  userSessionChange: EventEmitter<UserSession> = new EventEmitter<UserSession>();
  loginErrorMessage: string;
  login: FormGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
    rememberMe: new FormControl()
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
      password: new FormControl(),
      rememberMe: new FormControl()
    });
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
    if (validateLogin) {
      if (validateLogin.valid) {
        this.loginService.login(loginCombo.username, loginCombo.password, this.login.value['']).subscribe(userSession => {
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
      this.navigate('/home');
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
  atSignupPage() {
    return this.router.url === '/signup';
  }
  atSigninPage() {
    return this.router.url === '/signin';
  }
  loadNotification(notification: Notification) {
    // TODO Load Notification????
  }
  hasNewNotifications() {
    return this.notifications.some(notification => !notification.viewed);
  }
  showLinks() {
    return !['/', '/home', '/signin', '/signup'].some(path => path === this.router.url);
  }
  navigate(path: string) {
    $('#navbarSupportedContent.show').collapse('hide');
    this.router.navigate([path]);
  }
}
