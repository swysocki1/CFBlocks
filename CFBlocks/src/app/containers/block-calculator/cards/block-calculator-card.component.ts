import {Component, EventEmitter, Input, Output} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {TextInput, SelectInput} from "../block-calculator.model";

@Component({
  selector: 'block-calculator-card',
  template: `
    <img class="card-img-top" [src]="imgSrc" [alt]="imgAlt">
    <div class="card-body">
      <h5 class="card-title" *ngIf="title">{{title}}</h5>
      <form class="form" role="form" [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="select || input">
        <div class="form-group">
          <label class="control-label">
            <span *ngIf="input">{{input.label}}</span>
            <span *ngIf="select">{{select.label}}</span>
          </label>
          <div class="input-group">
            <input type="text" [type]="input.type || 'text'" class="form-control" formControlName="answer" [attr.placeholder]="input.placeholder" [(ngModel)]="input.value" *ngIf="input"/>
            <select formControlName="answer" class="form-control" [attr.placeholder]="select.placeholder" [(ngModel)]="select.value" *ngIf="select">
              <option *ngFor="let option of select.options" [value]="option.value">{{option.label}}</option>
            </select>
            <div class="input-group-append">
              <span class="input-group-text" *ngIf="input && input.postLabel">{{input.postLabel}}</span>
              <span class="input-group-text" *ngIf="select && select.postLabel">{{select.postLabel}}</span>
              <button type="submit" class="btn btn-primary input-group-append" [disabled]="disableSubmit()">Next</button>
            </div>
          </div>
        </div>
      </form>
      <p *ngIf="paragraph">{{paragraph}}</p>
    </div>
  `,
  styles: [`
    .card-title {border-bottom: 2px solid #eee;}
  `]
})
export class BlockCalculatorCardComponent {
  @Input() imgSrc: string;
  @Input() imgAlt: string;
  @Input() title: string;
  @Input() paragraph: string;
  @Input() input: TextInput;
  @Input() select: SelectInput;
  @Output() result: EventEmitter<any> = new EventEmitter<any>();
  
  form: FormGroup = new FormGroup({
    answer: new FormControl()
  });
  
  onSubmit() {
    const result = this.form.value['answer'];
    if(result) {
      if(typeof result === 'string') {
        if (result.trim())
          this.result.emit(result);
      } else {
        this.result.emit(result);
      }
    }
  }
  disableSubmit(): boolean {
    const result = this.form.value['answer'];
    if(result) {
      if(typeof result === 'string') {
        if (result.trim())
          return false;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
}
