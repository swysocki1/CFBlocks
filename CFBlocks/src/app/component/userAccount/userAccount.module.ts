import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserAccountComponent} from './userAccount.component';
import {UtilService} from '../../../services/util.service';
import {UserGeneralInfoComponent} from './generalInfo/generalInfo.component';
import {UserBodyInfoComponent} from './userBody/userBodyInfo.component';
import {UserLifeStyleComponent} from './lifestyle/lifestyle.component';
import {UserBlockTemplateComponent} from './blockTemplate.component.ts/blockTemplate.component';

@NgModule({
  declarations: [
    UserAccountComponent,
    UserGeneralInfoComponent,
    UserBodyInfoComponent,
    UserLifeStyleComponent,
    UserBlockTemplateComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    UserAccountComponent,
    UserGeneralInfoComponent,
    UserBodyInfoComponent,
    UserLifeStyleComponent,
    UserBlockTemplateComponent
  ],
  providers: [UtilService]
})
export class UserAccountModule { }
