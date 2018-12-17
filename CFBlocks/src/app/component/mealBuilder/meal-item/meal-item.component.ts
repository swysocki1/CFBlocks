import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Meal} from "../../../../models/meal.module";
import {LoginService} from "../../../../services/login.service";
import {FirebaseAbstractionLayerService} from "../../../../services/firebaseAbstractionLayer.service";
import {MealService} from "../../../../services/meal.service";
import {BlockCalculatorService} from "../../../../services/block-calculator.service";
declare var $:any;
@Component({
  selector: 'meal-item',
  templateUrl: './meal-item.html',
  styles: [`
    .card-body { padding: 10px;}
    .update-meal {
      display:inline-block;
      min-width:22px;
      margin: .2em;
      opacity:.8;
    }
    .update-meal.active,
    .update-meal:hover {
      opacity:1;
    }
    .update-meal.dropdown-toggle::before {
      display:none !important;
    }
  `]
})
export class MealItemComponent {
  @Input() meal: Meal;
  @Output() mealSelection: EventEmitter<Meal> = new EventEmitter<Meal>();
  displayNutritionFacts = true;
  constructor(private ls: LoginService, private fsa: FirebaseAbstractionLayerService, private mealService: MealService, private bc: BlockCalculatorService) { }
  selectMeal() {
    $('#meal-selector-modal').modal('hide');
    this.mealSelection.emit(this.meal);
  }
  toggleNutritionFacts() {
    this.displayNutritionFacts = !this.displayNutritionFacts;
  }
  isFavoriteMeal() {
    return this.mealService.isFavoriteMeal(this.meal);
  }
  favoriteMeal() {
    this.fsa.favoriteMeal(this.ls.getUser(), this.meal).subscribe(res => {
      console.log(res);
    },error => {
      console.error(error);
    });
  }
  unFavoriteMeal() {
    this.fsa.unFavoriteMeal(this.ls.getUser(), this.meal).subscribe(res => {
      console.log(res);
    },error => {
      console.error(error);
    });
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
}
