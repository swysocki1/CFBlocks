import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../environments/environment';
import {UserSession} from '../models/user.model';
import {LoginService} from '../services/login.service';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userSession: UserSession = new UserSession();
  currentPathname = '';
  backgroundClasses = environment.themes;
  constructor(private router: Router, private ls: LoginService) {}
  ngOnInit() {
    this.userSession = this.ls.getUserSession();
    this.ls.getUserSessionUpdates.subscribe(update => {
      this.userSession = update;
    });
    this.router.events.subscribe(event => {
      if (event && event['url']) {
        this.updateMainBackground(event['url']);

        if (this.userSession && this.userSession.authenticated) {
          if (event['url'] === '/home' || event['url'] === '/') {
            this.router.navigate(['/meal-calendar']);
          }
        } else {
          if (this.userSession && !this.userSession.authenticated) {
            this.router.navigate(['/home']);
          }
        }
      }
    });
  }
  updateMainBackground(pathname?: string) {
    if ((!this.currentPathname && pathname) || this.currentPathname !== pathname) {
      let backgroundClass = '';
      console.log(pathname);
      if (pathname !== '/home' && pathname !== '/') {
        backgroundClass = 'kitchen-theme';
      }
      const selector = $('html, body');
      if (backgroundClass) {
        if (!selector.hasClass(backgroundClass)) {
          selector.removeClass(this.backgroundClasses.join(' '));
          selector.addClass(backgroundClass);
        }
      } else {
        selector.removeClass(this.backgroundClasses.join(' ')); // Set default
      }
      this.currentPathname = pathname;
    }
  }
}
