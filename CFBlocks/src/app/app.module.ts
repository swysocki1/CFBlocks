import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {FooterComponent} from './footer/footer.component';
import {HomeComponent} from './containers/home/home.component';
import {RouterModule} from '@angular/router';
import {routes} from './app.router';
import {LoginService} from '../services/login.service';
import {ValidationService} from '../services/validation.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NavbarSearchService} from './navbar/navbar-search.service';
import {AdminComponent} from './containers/admin/admin.component';
import {MealCalendarComponent} from './containers/meal-calendar/meal-calendar.component';
import {NotificationService} from '../services/notification.service';
import {BlockCalculatorModule} from './containers/block-calculator/block-calculator.module';
import {CalendarModule} from './component/calendar/calendar.module';
import {MealService} from '../services/meal.service';
import {HelperService} from '../services/helper.service';
import {FirebaseModule} from './firebase/firebase.module';
import {SignupModule} from './containers/signup/signup.module';
import {FirebaseService} from '../services/firebase.service';
import {UtilService} from '../services/util.service';
import {UserAccountModule} from './component/userAccount/userAccount.module';
import {SigninModule} from './containers/signin/signin.module';
import {MealBuilderModule} from './component/mealBuilder/mealBuilder.module';


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
    FirebaseModule,
    BlockCalculatorModule,
    CalendarModule,
    SigninModule,
    SignupModule,
    UserAccountModule,
    MealBuilderModule
  ],
  providers: [LoginService,
    ValidationService,
    NavbarSearchService,
    NotificationService,
    MealService,
    HelperService,
    FirebaseService,
    UtilService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
