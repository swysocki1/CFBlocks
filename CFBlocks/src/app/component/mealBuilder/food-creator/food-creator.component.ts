import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Food, mergeFood} from '../../../../models/meal.module';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../../../services/validation.service';
import {mergeUser, User, UserSession} from '../../../../models/user.model';
import {FirebaseService} from '../../../../services/firebase.service';
import {LoginService} from "../../../../services/login.service";
import {Router} from "@angular/router";
import {FirebaseAbstractionLayerService} from "../../../../services/firebaseAbstractionLayer.service";

@Component({
  selector: 'food-creator',
  templateUrl: 'food-creator.html',
  styles: [`
    .allFoods {
      overflow-y: auto;
      max-height: 30vh;
    }
  `]
})
export class FoodCreatorComponent implements OnInit {
  user: User;
  food: Food;
  form: FormGroup;
  view = 'Create New';
  allFoods = [];
  foodsSelected = [];
  showAllFoods = true;
  constructor(private fb: FormBuilder, private vs: ValidationService, private firebase: FirebaseService,
              private ls: LoginService, private router: Router, private fba: FirebaseAbstractionLayerService) {}
  ngOnInit() {
    this.user = this.ls.getUser();
    this.ls.getUserUpdates.subscribe(user => {
      this.user = user;
    }, error => {console.error(error)});
    this.loadForm();
    this.router.events.subscribe(event => {
      if (event && event['url']) {
        const food = this.getFoodFromUrl(event['url']);
        console.log(food);
        this.loadFood(food);
      }
    });
    this.firebase.getAllFoods(this.ls.getUser(), this.isAdmin()).subscribe(foods => {
      this.allFoods = foods;
      console.log(foods);
    }, error => {console.error(error)});
  }
  getFoodFromUrl(url: string): string {
    if (url) {
      const urlParseArr = url.split('/');
      console.log(urlParseArr);
      let str = urlParseArr[urlParseArr.length - 1];
      console.log(str);
      if (str.indexOf(';') >= 0) {
        str = str.substring(0, str.indexOf(';'));
      }
      if (str.indexOf('?') >= 0) {
        str = str.substring(0, str.indexOf('?'));
      }
      if (str === 'new') {
        return null;
      }
      return str;
    }
    return null;
  }
  loadFood(food: string) {
    if (food) {
      this.fba.getFoodById(food).subscribe(food => {
        this.food = food;
        this.loadForm();
      }, error => {
        console.error(error);
      })
    } else {
      this.loadForm();
    }
  }
  onSubmit() {
    if (this.form.valid) {
      const food: Food = new Food();
      food.name = this.form.value.name;
      food.carb = this.form.value.carb;
      food.fat = this.form.value.fat;
      food.protein = this.form.value.protein;
      food.serving.amount = this.form.value.servings;
      food.serving.metric = this.form.value.serving;
      food.isCustom = this.form.value.isCustom;
      let newUpdate = false;
      if (!this.food.id) {
        newUpdate = true;
      }
      this.food = mergeFood(this.food, food);
      if (newUpdate) {
        if (!this.ls.isAdmin()) {
          this.food.isCustom = true;
        }
        this.food.id = this.firebase.createId();
        this.firebase.createFood(this.food).then(() => {
          if (this.food.isCustom) {
            this.ls.addCustomFood(this.food).subscribe(res => {
              // this.cancelEvent.emit(true);
            }, error => {
              console.error(error);
            });
          }
        }).catch(error => {
          console.error(error);
        });
      } else {
        this.firebase.updateFood(this.food).then(() => {
          // this.cancelEvent.emit(true);
        });
      }
    } else {
      this.vs.validateAllFormFields(this.form);
    }
  }
  loadForm() {
    let food  = new Food();
    console.log(food);
    if (this.food) {
      food = {... this.food} as Food;
    }
    console.log(food);
    this.form = this.fb.group({
      foodFilter: [''],
      name: [food.name, Validators.required],
      carb: [food.carb, Validators.required],
      fat: [food.fat, Validators.required],
      protein: [food.protein, Validators.required],
      serving: [food.serving.metric, Validators.required],
      servings: [food.serving.amount, Validators.required],
      isCustom: [food.isCustom]
    });
    if (this.food) {
      this.vs.validateAllFormFields(this.form);
    }
  }
  reset() {
    this.loadForm();
  }
  isFieldInvalid(field: string) {
    return this.vs.isFieldInvalid(this.form, field);
  }
  isFieldValid(field: string) {
    return this.vs.isFieldValid(this.form, field);
  }
  isAdmin() {
    return this.ls.isAdmin();
  }
  goBack() {
  
  }
  isSelected(food: Food) {
    if (food) {
      return this.foodsSelected.some(f => f.id === food.id);
    } else {
      return false;
    }
  }
  selectFood(food: Food) {
    if (!this.isSelected(food)) {
      this.foodsSelected.push(food);
    }
  }
  unselectFood(food: Food) {
    if (this.isSelected(food)) {
      this.foodsSelected.splice(this.foodsSelected.findIndex(f => f.id === food.id), 1);
    }
  }
  toggleView(view: string) {
    if (this.view !== view) {
      this.loadFood(this.food ? this.food.id : null);
      this.view = view;
      if (view !== 'Mix Foods') {
        this.foodsSelected = [];
      }
    }
  }
  viewIsActive(view: string) {
    return this.view === view;
  }
  collapseAllFoods() {
    this.showAllFoods = !this.showAllFoods;
  }
}
