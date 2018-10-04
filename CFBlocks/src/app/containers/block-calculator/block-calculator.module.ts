import {NgModule} from '@angular/core';
import {BlockCalculatorComponent} from './block-calculator.component';
import {BlockCalculatorResultsComponent} from './cards/results/block-calculator-results.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BlockCalculatorCardComponent} from './cards/block-calculator-card.component';
import {BlockCalculatorService} from '../../../services/block-calculator.service';
import {UserAccountModule} from '../../component/userAccount/userAccount.module';
import {LetsGetStartedComponent} from './cards/getStarted/getStarted.component';

@NgModule({
  declarations: [
    BlockCalculatorComponent,
    BlockCalculatorResultsComponent,
    BlockCalculatorCardComponent,
    LetsGetStartedComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    UserAccountModule
  ],
  exports: [
    BlockCalculatorComponent,
    BlockCalculatorResultsComponent,
    BlockCalculatorCardComponent,
    LetsGetStartedComponent
  ],
  providers: [BlockCalculatorService]
})
export class BlockCalculatorModule { }
