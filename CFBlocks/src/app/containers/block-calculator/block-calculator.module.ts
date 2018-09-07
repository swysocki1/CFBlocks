import {NgModule} from "@angular/core";
import {BlockCalculatorComponent} from "./block-calculator.component";
import {BlockCalculatorResultsComponent} from "./cards/block-calculator-results.component";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BlockCalculatorCardComponent} from "./cards/block-calculator-card.component";
import {BlockCalculatorService} from "../../../services/block-calculator.service";

@NgModule({
  declarations: [
    BlockCalculatorComponent,
    BlockCalculatorResultsComponent,
    BlockCalculatorCardComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule],
  exports: [
    BlockCalculatorComponent,
    BlockCalculatorResultsComponent,
    BlockCalculatorCardComponent
  ],
  providers: [BlockCalculatorService]
})
export class BlockCalculatorModule { }
