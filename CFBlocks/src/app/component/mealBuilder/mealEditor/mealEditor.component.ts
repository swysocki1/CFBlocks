import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Food, Meal, MealFood} from '../../../../models/meal.module';
import {BlockCalculatorService} from '../../../../services/block-calculator.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../../../services/validation.service';

@Component({
  selector: 'meal-editor',
  templateUrl: 'meal-editor.html',
  styles: [`
    .meal-editor {
      height: 80vh;
      overflow-y: scroll;
    }
    .meal-food-item-header {
      position: sticky;
      position: -webkit-sticky;
      top: 0;
      z-index: 1;
    }
  `]
})
export class MealEditorComponent implements OnInit, OnChanges {
  @Input() meal: Meal;
  form: FormGroup;
  constructor(private bc: BlockCalculatorService, private fb: FormBuilder, private vs: ValidationService) { }
  ngOnInit() {
    this.loadForm();
  }
  loadForm(meal?: Meal) {
    if (!meal) {
      meal = new Meal();
    }
    if (this.meal) {
      meal = {... this.meal} as Meal;
    }
    this.form = this.fb.group({});
    meal.foods.forEach(food => {
      this.form.addControl(food.food.name, this.fb.control([food.servingAmount, Validators.required]));
    });
    if (this.meal) {
      this.vs.validateAllFormFields(this.form);
    }
  }
  isFieldInvalid(field: string) {
    if (this.form[field]) {
      return this.vs.isFieldInvalid(this.form, field);
    } else {
      return false;
    }
  }
  isFieldValid(field: string) {
    if (this.form[field]) {
      return this.vs.isFieldValid(this.form, field);
    } else {
      return false;
    }
  }
  removeFood(food: Food) {
    // TODO something???
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.meal.currentValue) {
      this.loadForm(changes.meal.currentValue);
    }
  }
}
