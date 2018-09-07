import {Component, Input} from "@angular/core";
import {BlockCalculatorAnswers} from "../block-calculator.model";
import {BlockCalculatorService} from "../../../../services/block-calculator.service";

@Component({
  selector: 'block-calculator-results',
  template: `
    <div class="card-body">
      <h5 class="card-title">Here is your Block Perscription: </h5>
      <p>You are to eat {{results.result.blocks}} blocks a day!</p>
      <p>Each block will consist of {{getCarbs(1)}}g Carbs, {{getFats(1)}}g Fats, and {{getProtein(1)}}g Protein.</p>
      <p>Total Each Day you should eat {{getCarbs(results.result.blocks)}}g Carbs, {{getFats(results.result.blocks)}}g Fats, and {{getProtein(results.result.blocks)}}g Protein.</p>
    </div>
  `
})
export class BlockCalculatorResultsComponent {
  @Input() results: BlockCalculatorAnswers;
  constructor(private blockCalculatorService: BlockCalculatorService) {
  
  }
  getCarbs(blocks: number) {
    return this.blockCalculatorService.getCarbs(blocks);
  }
  getFats(blocks: number) {
    return this.blockCalculatorService.getFats(blocks);
  }
  getProtein(blocks: number) {
    return this.blockCalculatorService.getProtein(blocks);
  }
}
