import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Food, Meal} from '../../../../models/meal.module';
import {BlockCalculatorService} from '../../../../services/block-calculator.service';
import {MealService} from "../../../../services/meal.service";
import {FirebaseAbstractionLayerService} from "../../../../services/firebaseAbstractionLayer.service";
import {LoginService} from "../../../../services/login.service";

@Component({
  selector: 'food-item',
  templateUrl: './food-item.html',
  styles: [`
    .card-body { padding: 10px;}
    .update-food {
      display:inline-block;
      min-width:22px;
      margin: .2em;
      opacity:.8;
    }
    .update-food.active,
    .update-food:hover {
      opacity:1;
    }
    .update-food.dropdown-toggle::before {
      display:none !important;
    }
  `]
})
export class FoodItemComponent {
  @Input() food: Food;
  @Input() canAdd: boolean;
  @Input() canUpdate: boolean;
  @Input() canRemove: boolean;
  @Input() isSelected: boolean;
  @Output() updateFood: EventEmitter<Food> = new EventEmitter<Food>();
  @Output() add: EventEmitter<Food> = new EventEmitter<Food>();
  @Output() remove: EventEmitter<Food> = new EventEmitter<Food>();
  displayNutritionFacts = true;
  constructor(private bc: BlockCalculatorService, private mealService: MealService, private fsa: FirebaseAbstractionLayerService,
              private ls: LoginService) { }
  calcCalories(food: Food) {
    return this.bc.calcFoodCalories(food);
  }
  loadFoodModal() {
    if (this.canUpdate) {
      this.updateFood.emit(this.food);
    }
  }
  toggleSelectFood() {
    if (this.isSelected) {
      this.removeFood();
    } else {
      this.addFood();
    }
  }
  removeFood() {
    if (this.canRemove) {
      this.remove.emit(this.food);
    }
  }
  addFood() {
    if (this.canAdd) {
      this.add.emit(this.food);
    }
  }
  canEdit() {
    if (this.canUpdate) {
      if (this.food) {
        if (this.food.isCustom) {
          return this.ls.isAdmin() || this.ls.getUser().customFoods.some(food => food.id === this.food.id);
        } else {
          return this.ls.isAdmin();
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  hasAdditionalVariations(): boolean {
    return true;
  }
  isFavoriteFood() {
    return this.mealService.isFavoriteFood(this.food);
  }
  favoriteFood() {
    this.fsa.favoriteFood(this.ls.getUser(), this.food).subscribe(res => {
      console.log(res);
    },error => {
      console.error(error);
    });
  }
  unFavoriteFood() {
    this.fsa.unFavoriteFood(this.ls.getUser(), this.food).subscribe(res => {
      console.log(res);
    },error => {
      console.error(error);
    });
  }
  toggleNutritionFacts() {
    this.displayNutritionFacts = !this.displayNutritionFacts;
  }
}
