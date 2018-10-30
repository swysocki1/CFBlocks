import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Food, Meal, MealFood} from '../../../../models/meal.module';
import {BlockCalculatorService} from '../../../../services/block-calculator.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../../../services/validation.service';
import {FirebaseService} from '../../../../services/firebase.service';
import {LoginService} from '../../../../services/login.service';

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
    .meal-food-item-header.card .card-body {
      padding: .2rem 1.25rem;
    }
    .meal-food-item-header.card .card-body label.control-label{
      margin-bottom: 0;
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
    .meal-editor-submit-container {
      background-color: inherit;
    }
  `]
})
export class MealEditorComponent implements OnInit, OnChanges {
  @Input() meals: [Meal] = [] as [Meal];
  @Output() saveMeals = new EventEmitter<[Meal]>();
  @Output() loadMealModal = new EventEmitter();
  form: FormGroup;
  constructor(private bc: BlockCalculatorService, private fb: FormBuilder, private vs: ValidationService, private fs: FirebaseService, private ls: LoginService) { }
  ngOnInit() {
    this.loadForm();
  }
  save() {
    console.log(this.meals);
    this.saveMeals.emit(this.meals);
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
    meals.forEach((meal, m) => {
      meal.foods.forEach((food, f) => {
        if (meals[m].foods[f].food) {
          this.form.addControl(`${meal.name}${food.food.name}`, this.fb.control([food.servingAmount, Validators.required]));
        }
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
  updateFood(food: MealFood) {
    if (this.meals && this.meals.length) {
      const m = this.meals.findIndex(meal => meal.foods.some(mealFood => mealFood.food.id === food.food.id));
      if (this.meals[m] && this.meals[m].foods.length) {
        const mf = this.meals[m].foods.findIndex(mealFood => mealFood.food.id === food.food.id);
        this.meals[m].foods[mf] = food;
      }
    }
  }
  removeFood(food: MealFood) {
    // TODO something???
  }
  hasFoods() {
    return this.meals && this.meals.length;
  }
  reset() {
    // TODO???
  }
  getMealCarbs(meal: Meal) {
    let grams = 0;
    if (meal) {
      meal.foods.forEach(food => {
        grams += this.bc.getFoodMealCarbs(food);
      });
    }
    return grams;
  }
  getMealFats(meal: Meal) {
    let grams = 0;
    if (meal) {
      meal.foods.forEach(food => {
        grams += this.bc.getFoodMealFats(food);
      });
    }
    return grams;
  }
  getMealProtein(meal: Meal) {
    let grams = 0;
    if (meal) {
      meal.foods.forEach(food => {
        grams += this.bc.getFoodMealProtein(food);
      });
    }
    return grams;
  }
  getMealCalories(meal: Meal) {
    let grams = 0;
    if (meal) {
      meal.foods.forEach(food => {
        grams += this.bc.calcCalories(food);
      });
    }
    return grams;
  }
  getMealCollapseId(meal: Meal): string {
      return 'collapse-' + meal.name.replace(new RegExp(' ', 'g'), '-').replace(new RegExp('\'', 'g'), '-');
  }
  createNewMeal() {
    this.loadMealModal.emit();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.meals.currentValue) {
      this.loadForm(changes.meals.currentValue);
    }
  }
}
