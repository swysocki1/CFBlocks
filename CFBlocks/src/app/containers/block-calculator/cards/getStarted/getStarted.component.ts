import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BlockCalculatorService} from '../../../../../services/block-calculator.service';
import {User} from '../../../../../models/user.model';
import {Router} from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'lets-get-started',
  templateUrl: 'lets-get-started.html'
})
export class LetsGetStartedComponent {
  @Output() getStarted = new EventEmitter<boolean>();
  letsGetStarted() {
    this.getStarted.emit(true);
  }
}
