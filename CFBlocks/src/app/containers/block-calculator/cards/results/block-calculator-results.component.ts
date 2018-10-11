import {Component, Input} from '@angular/core';
import {BlockCalculatorService} from '../../../../../services/block-calculator.service';
import {User} from '../../../../../models/user.model';
import {Router} from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'block-calculator-results',
  templateUrl: 'block-calc-results.html'
})
export class BlockCalculatorResultsComponent {
  @Input() user: User;
  constructor(private blockCalculatorService: BlockCalculatorService, private router: Router) { }
  getBlocks(): number {
    if (this.user && this.user.blockTemplate && this.user.blockTemplate.metric === 'Zone Block') {
      return this.blockCalculatorService.getBlocks(this.user);
    } else {
      return null;
    }
  }
  getCarbs() {
    return this.blockCalculatorService.dailyCarbs(this.user);
  }
  getFats() {
    return this.blockCalculatorService.dailyFats(this.user);
  }
  getProtein() {
    return this.blockCalculatorService.dailyProtein(this.user);
  }
  next() {
    this.router.navigate(['/meal-builder', moment().format('MMDDYY')]);
  }
}
