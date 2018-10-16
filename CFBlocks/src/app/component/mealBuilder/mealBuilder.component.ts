import {Component, Input, OnInit, Output, Pipe, PipeTransform} from '@angular/core';
import {Food, Meal, MealFood} from '../../../models/meal.module';
import {ValidationService} from '../../../services/validation.service';
import {FirebaseService} from '../../../services/firebase.service';
import {BlockCalculatorService} from '../../../services/block-calculator.service';
import {map, switchMap} from 'rxjs/operators';
import {ActivatedRoute, ParamMap, Route, Router} from '@angular/router';
declare var $: any;
import * as moment from 'moment';
import {User} from '../../../models/user.model';
import {LoginService} from '../../../services/login.service';

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
  user: User;
  @Input() meals: [Meal] = [] as [Meal];
  @Output() mealUpdated: Meal;
  foods: [Food] = [] as [Food];
  meal: Meal = new Meal();
  search = '';
  updateFood: Food;
  mealDay: Date = new Date();
  constructor(private fs: FirebaseService, private bc: BlockCalculatorService, private route: ActivatedRoute, private router: Router, private ls: LoginService) { }
  getFormatedName() {
    return this.ls.getFormatedName();
  }
  ngOnInit() {
    this.user = this.ls.getUser();
    this.ls.getUserUpdates.subscribe(user => {
      this.user = user;
    });
    this.route.paramMap.pipe(
      map((params: ParamMap) =>
        moment(params.get('date'), 'MMDDYY').toDate())
    ).subscribe(date => {
      this.mealDay = date;
    }, error => {
      console.error(error);
    });
    $('#meal-builder-date-dropdown-menu').datepicker({startDate: this.mealDay}).on('changeDate', (event) => {
      this.router.navigate(['/meal-builder', moment(event.date).format('MMDDYY')]);
    });
    this.fs.getAllFoods().subscribe(foods => {
      this.foods = foods as [Food];
    });
  }
  loadSelectFoodModule(meal?: Meal) {
    if (meal) {
      this.meal = meal;
    }
    this.resetFoodCreator();
    $('#food-selector-modal').modal('show');
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
  addFoodToMeal(food: Food) {
    const mealFood = new MealFood();
    mealFood.food = {... food};
    mealFood.servingAmount = food.serving.amount;
    this.meal.foods.push(mealFood);
  }
  updateMeal() {
    if (this.meal) {
      const meal = this.meals.find(meal => meal.name === this.meal.name);
      if (meal) {
        meal.foods = this.meal.foods;
      } else {
        this.meals.push(this.meal);
      }
    }
    // TODO update to firestore
  }
  getMealCarbTotal() {
    let total = 0;
    this.meal.foods.forEach(food => {
      total += this.bc.calcCarbs(food);
    });
    return total;
  }
  getMealFatTotal() {
    let total = 0;
    this.meal.foods.forEach(food => {
      total += this.bc.calcFats(food);
    });
    return total;
  }
  getMealProteinTotal() {
    let total = 0;
    this.meal.foods.forEach(food => {
      total += this.bc.calcProtein(food);
    });
    return total;
  }
  getMealCalorieTotal() {
    let total = 0;
    this.meal.foods.forEach(food => {
      total += this.bc.calcCalories(food);
    });
    return total;
  }
  getDailyCarbTotal() {
    return this.bc.dailyCarbs(this.user);
  }
  getDailyFatTotal() {
    return this.bc.dailyFats(this.user);
  }
  getDailyProteinTotal() {
    return this.bc.dailyProtein(this.user);
  }
  getDailyCalorieTotal() {
    return this.bc.dailyCals(this.user);
  }
}

