import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserAccountComponent} from './userAccount.component';
import {UtilService} from '../../../services/util.service';
import {UserGeneralInfoComponent} from './generalInfo/generalInfo.component';
import {FieldErrorDisplayModule} from '../fieldDisplayError/fieldErrorDisplay.module';

@NgModule({
  declarations: [
    UserAccountComponent,
    UserGeneralInfoComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    FieldErrorDisplayModule
  ],
  exports: [
    UserAccountComponent,
    UserGeneralInfoComponent
  ],
  providers: [UtilService]
})
export class UserAccountModule { }
