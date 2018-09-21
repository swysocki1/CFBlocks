import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserAccountComponent} from './userAccount.component';
import {UtilService} from '../../../services/util.service';

@NgModule({
  declarations: [
    UserAccountComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [UserAccountComponent],
  providers: [UtilService]
})
export class UserAccountModule { }
