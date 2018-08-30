import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {NavbarComponent} from "./navbar/navbar.component";
import {FooterComponent} from "./footer/footer.component";
import {HomeComponent} from "./containers/home/home.component";
import {RouterModule} from "@angular/router";
import {routes} from './app.router';
import {LoginService} from "../services/login.service";
import {ValidationService} from "../services/validation.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NavbarSearchService} from "./navbar/navbar-search.service";
import {AdminComponent} from "./containers/admin/admin.component";
import {MealCalendarComponent} from "./containers/meal-calendar/meal-calendar.component";
import {NotificationService} from "../services/notification.service";
import {BlockCalculatorModule} from "./containers/block-calculator/block-calculator.module";


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    AdminComponent,
    MealCalendarComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    BlockCalculatorModule
  ],
  providers: [LoginService,ValidationService,NavbarSearchService,NotificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
