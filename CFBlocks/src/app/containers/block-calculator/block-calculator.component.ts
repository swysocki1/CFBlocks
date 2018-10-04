import {Component, OnInit} from '@angular/core';
import {BlockCalculatorService} from '../../../services/block-calculator.service';
import {User} from '../../../models/user.model';
import {LoginService} from '../../../services/login.service';

@Component({
  templateUrl: './block-calculator.html',
  styles: [`
    .block-calculator {
      min-height: 70vh;
    }
    .center {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .block-calc-footer {
      margin-top: -3px;
    }
    .block-calc-footer .card-body{
      padding: 5px 0;
    }
    .block-calc-footer .card-body i.fa {
      opacity: .3;
    }
  `]
})
export class BlockCalculatorComponent implements OnInit {
  blockCalculatorPage = 0;
  userAccount: User;
  fieldSet;
  fieldSets = ['Let\'s Get Started', 'General Info', 'Body Measurements', 'Life Style', 'Meal Template', 'Results'];

  constructor(private blockCalculatorService: BlockCalculatorService, private ls: LoginService) { }
  ngOnInit() {
    this.updateUser(this.ls.getUser() as User);
    this.ls.getUserUpdates.subscribe(update => {
      this.updateUser(update);
    });
  }
  updateUser(user: User) {
    this.userAccount = user;
    this.fieldSet = null;
    this.nextCard();
  }
  toggleFieldSet(fieldSet: string) {
    if (this.fieldSet && this.fieldSet === fieldSet) {
      this.fieldSet = null;
    } else {
      this.fieldSet = fieldSet;
    }
  }
  fieldSetActive(fieldSet: string) {
    if (this.fieldSet) {
      return this.fieldSet === fieldSet;
    } else {
      return false;
    }
  }
  nextCard(): void {
    this.blockCalculatorPage += 1;
    this.toggleFieldSet(this.fieldSets[this.blockCalculatorPage]);
  }
  backCard(): void {
    this.blockCalculatorPage -= 1;
    this.toggleFieldSet(this.fieldSets[this.blockCalculatorPage]);
  }

  disableBackBtn(): boolean {
    return this.blockCalculatorPage < 1;
  }
  disableNextBtn(): boolean {
    if (this.blockCalculatorPage >= this.fieldSets.length - 1) {
      return true;
    } else {
      return false; // TODO more logic
    }
  }
}
