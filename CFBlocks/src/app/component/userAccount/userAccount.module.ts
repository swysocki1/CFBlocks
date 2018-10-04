import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserAccountComponent} from './userAccount.component';
import {UtilService} from '../../../services/util.service';
import {UserGeneralInfoComponent} from './generalInfo/generalInfo.component';
import {UserBodyInfoComponent} from './userBody/userBodyInfo.component';

@NgModule({
  declarations: [
    UserAccountComponent,
    UserGeneralInfoComponent,
    UserBodyInfoComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    UserAccountComponent,
    UserGeneralInfoComponent,
    UserBodyInfoComponent
  ],
  providers: [UtilService]
})
export class UserAccountModule { }
