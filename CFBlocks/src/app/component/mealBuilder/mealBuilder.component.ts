import {Component, Input, OnInit, Pipe, PipeTransform} from '@angular/core';
import {Food, Meal} from '../../../models/meal.module';
import {ValidationService} from '../../../services/validation.service';
import {FirebaseService} from '../../../services/firebase.service';
declare var $: any;

@Pipe({
  name: 'foodFilter'
})
export class FoodFilterPipe implements PipeTransform {
  constructor(private vs: ValidationService) {}
  transform(items: [Food], filter: {search: string, alreadyUsed: [Food]}): [Food] {
    if (!items || items.length < 1) {
      return items;
    }
    items = items.filter(item => filter.alreadyUsed.some(food => food.name !== item.name) &&
      (!filter.search || item.name.indexOf(filter.search) >= 0)) as [Food];
    return items.sort((f1, f2) => {
      if (f1.name > f2.name) {
        return 1;
      }
      if (f1.name > f2.name) {
        return -1;
      }
      return 0;
    }) as [Food];
  }
}
@Component({
  selector: 'meal-builder',
  templateUrl: './meal-builder.html',
  styles: [`
    .create-food{
      display:inline-block;
      padding:6px;
      opacity: 0.3;
      /*margin: 0 15px;*/
    }
    .create-food:hover {
      opacity:1;
    }
  `]
})
export class MealBuilderComponent implements OnInit {
  @Input() meal: Meal;
  foods: [Food] = [] as [Food];
  search: string;
  updateFood: Food;
  constructor(private fs: FirebaseService) { }
  ngOnInit() {
    // this.fs.getAllFoods().subscribe(foods => {
    //   this.foods = foods as [Food];
    // });
  }
  loadFoodModal(food?: Food) {
    if (food) {
      this.updateFood = food;
    } else {
      this.updateFood = new Food();
    }
    $('#modify-food-modal').modal('show');
  }
  resetFoodCreator() {
    $('#modify-food-modal').modal('hide');
    this.updateFood = new Food();
  }
}
