import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserAccountComponent} from './userAccount.component';
import {UtilService} from '../../../services/util.service';
import {UserGeneralInfoComponent} from './generalInfo/generalInfo.component';

@NgModule({
  declarations: [
    UserAccountComponent,
    UserGeneralInfoComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    UserAccountComponent,
    UserGeneralInfoComponent
  ],
  providers: [UtilService]
})
export class UserAccountModule { }
