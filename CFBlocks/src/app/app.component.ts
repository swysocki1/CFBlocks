import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../environments/environment';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentPathname = '';
  backgroundClasses = environment.themes;
  constructor(private router: Router) {}
  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event && event['url']) {
        this.updateMainBackground(event['url']);
      }
    });
  }
  updateMainBackground(pathname?: string) {
    if ((!this.currentPathname && pathname) || this.currentPathname !== pathname) {
      let backgroundClass = '';
      if (pathname !== '/home') {
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
