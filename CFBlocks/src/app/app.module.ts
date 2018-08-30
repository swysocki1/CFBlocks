import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {NavbarComponent} from "./navbar/navbar.component";
import {FooterComponent} from "./footer/footer.component";
import {HomeComponent} from "./home/home.component";
import {RouterModule} from "@angular/router";
import {routes} from './app.router';
import {LoginService} from "../services/login.service";
import {ValidationService} from "../services/validation.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NavbarSearchService} from "./navbar/navbar-search.service";


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [LoginService,ValidationService,NavbarSearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
