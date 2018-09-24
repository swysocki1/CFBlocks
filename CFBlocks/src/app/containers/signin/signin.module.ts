import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SigninComponent} from './signin.component';

@NgModule({
  declarations: [
    SigninComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [SigninComponent],
  providers: []
})
export class SigninModule { }
