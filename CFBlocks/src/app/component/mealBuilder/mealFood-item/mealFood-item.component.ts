import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Food, Meal, MealFood} from '../../../../models/meal.module';
import {BlockCalculatorService} from '../../../../services/block-calculator.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../../../services/validation.service';

@Component({
  selector: 'meal-food-item',
  templateUrl: './mealFood-item.html',
  styles: [`
    .food-statistics label {
      margin-bottom: 0;
    }
    .food-statistics input.form-control[readonly] {
      background-color: inherit;
      display: inline-block;
      width: auto;
    }
    button.btn-close {
      opacity: .85;
      margin-right: -20px;
    }
    button.btn-close:hover {
      opacity: 1;
    }
  `]
})
export class MealFoodItemComponent implements OnInit, OnChanges {
  @Input() food: MealFood;
  @Output() foodUpdate: EventEmitter<MealFood> = new EventEmitter<MealFood>();
  @Output() remove: EventEmitter<MealFood> = new EventEmitter<MealFood>();
  form: FormGroup;
  constructor(private bc: BlockCalculatorService, private fb: FormBuilder, private vs: ValidationService) { }
  ngOnInit() {
    this.loadForm();
  }
  calcCalories(food: MealFood) {
    return this.bc.calcCalories(food);
  }
  loadForm(food?: MealFood) {
    if (!food) {
      food = new MealFood();
    }
    if (this.food) {
      food = {... this.food} as MealFood;
    }
    this.form = this.fb.group({food: [food.servingAmount, Validators.required]});
    if (this.food) {
      this.vs.validateAllFormFields(this.form);
    }
  }
  updateMealFood() {
    if (this.form.valid) {
      this.food.servingAmount = this.form.value.food;
    } else {
      this.vs.validateAllFormFields(this.form);
    }
  }
  removeFood() {
    this.remove.emit(this.food);
  }
  isFieldInvalid() {
    return this.vs.isFieldInvalid(this.form, 'food');
  }
  isFieldValid() {
    return this.vs.isFieldValid(this.form, 'food');
  }
  getCarbs(food: MealFood): number {
    return this.bc.getFoodMealCarbs(food);
  }
  getFats(food: MealFood): number {
    return this.bc.getFoodMealFats(food);
  }
  getProtein(food: MealFood): number {
    return this.bc.getFoodMealProtein(food);
  }
  getCalories(food: MealFood): number {
    return this.bc.calcCalories(food);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.food.currentValue) {
      this.loadForm();
    }
  }
}
