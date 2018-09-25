import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-field-error-display',
  template: `
    {{displayError}}
    <div *ngIf="displayError" >
      <span class="glyphicon glyphicon-remove form-control-feedback fix-error-icon"></span>
      <span class="sr-only">(error)</span>
      <div class="invalid-feedback">{{errorMsg}}</div>
    </div>
  `,
  styles: [`
    .error-msg {
      color: #a94442;
    }
    .fix-error-icon {
      top: 27px;
    }
    .invalid-feedback {
      display: none;
      width: 100%;
      margin-top: .25rem;
      font-size: 80%;
      color: #dc3545;
    }
  `]
})
export class FieldErrorDisplayComponent {
  @Input() errorMsg: string;
  @Input() displayError: boolean;
}
