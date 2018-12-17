import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';

import { AppRoutingModule } from './app-routing.module.tns';
import { AppComponent } from './app.component.tns';

import {FirebaseAbstractionLayerService} from "../services/firebaseAbstractionLayer.service";
import {HelperService} from "../services/helper.service";
import {ValidationService} from "../services/validation.service";
import {MealService} from "../services/meal.service";
import {UtilService} from "../services/util.service";
import {NavbarSearchService} from "./navbar/navbar-search.service";
import {NotificationService} from "../services/notification.service";
import {FirebaseService} from "../services/firebase.service";
import {LoginService} from "../services/login.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CalendarModule} from "./component/calendar/calendar.module";
import {SignupModule} from "./containers/signup/signup.module";
import {MealBuilderModule} from "./component/mealBuilder/mealBuilder.module";
import {RouterModule} from "@angular/router";
import {routes} from "./app.router";
import {FirebaseModule} from "./firebase/firebase.module";
import {UserAccountModule} from "./component/userAccount/userAccount.module";
import {BrowserModule} from "@angular/platform-browser";
import {BlockCalculatorModule} from "./containers/block-calculator/block-calculator.module";
import {SigninModule} from "./containers/signin/signin.module";
import {NavbarComponent} from "./navbar/navbar.component";
import {HomeComponent} from "./containers/home/home.component.tns";
import {MealCalendarComponent} from "./containers/meal-calendar/meal-calendar.component";
import {FooterComponent} from "./footer/footer.component";
import {AdminComponent} from "./containers/admin/admin.component";

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from 'nativescript-angular/forms';

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
// import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
    // NavbarComponent,
    // FooterComponent,
    // HomeComponent,
    // AdminComponent,
    // MealCalendarComponent
  ],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
  
    // ReactiveFormsModule,
    // FormsModule,
    // BrowserModule,
    // FirebaseModule,
    // BlockCalculatorModule,
    // CalendarModule,
    // SigninModule,
    // SignupModule,
    // UserAccountModule,
    // MealBuilderModule
  ],
  providers: [
    // LoginService,
    // ValidationService,
    // NavbarSearchService,
    // NotificationService,
    // MealService,
    // HelperService,
    // FirebaseService,
    // FirebaseAbstractionLayerService,
    // UtilService
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
