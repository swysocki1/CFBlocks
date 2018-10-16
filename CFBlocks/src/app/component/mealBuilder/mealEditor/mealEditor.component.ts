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
      height: 70vh;
      overflow-y: scroll;
    }
    .meal-food-item-header {
      position: sticky;
      position: -webkit-sticky;
      top: 0;
      z-index: 1;
    }
    .meal-editor-submit-container {
      position: sticky;
      position: -webkit-sticky;
      bottom: 0;
      z-index: 1;
    }
    .toggle-foods{
      display:inline-block;
      padding:6px;
      opacity: 0.3;
      /*margin: 0 15px;*/
    }
    .toggle-foods:hover {
      opacity:1;
    }
  `]
})
export class MealEditorComponent implements OnInit, OnChanges {
  @Input() meals: [Meal] = [] as [Meal];
  form: FormGroup;
  constructor(private bc: BlockCalculatorService, private fb: FormBuilder, private vs: ValidationService) { }
  ngOnInit() {
    this.loadForm();
  }
  loadForm(meals?: [Meal]) {
    if (!meals || this.meals) {
      meals = [] as [Meal];
    }
    if (this.meals) {
      this.meals.forEach(m => {
        meals.push({... m} as Meal);
      });
    }
    this.form = this.fb.group({});
    meals.forEach(meal => {
      meal.foods.forEach(food => {
        this.form.addControl(`${meal.name}${food.food.name}`, this.fb.control([food.servingAmount, Validators.required]));
      });
    });
    if (this.meals) {
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
  hasFoods() {
    return this.meals && this.meals.length;
  }
  reset() {
    // TODO???
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.meals.currentValue) {
      this.loadForm(changes.meals.currentValue);
    }
  }
}
