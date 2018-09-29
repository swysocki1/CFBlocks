import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Food, mergeFood} from '../../../../models/meal.module';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../../../services/validation.service';
import {mergeUser, User, UserSession} from '../../../../models/user.model';
import {FirebaseService} from '../../../../services/firebase.service';

@Component({
  selector: 'food-creator',
  templateUrl: 'food-creator.html'
})
export class FoodCreatorComponent implements OnInit, OnChanges {
  @Input() food: Food;
  @Output() cancelEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  form: FormGroup;
  constructor(private fb: FormBuilder, private vs: ValidationService, private firebase: FirebaseService) { }
  ngOnInit() {
    this.loadForm();
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
      let newUpdate = false;
      if (this.food) {
        newUpdate = true;
      }
      console.log(food);
      console.log(this.food);
      this.food = mergeFood(this.food, food);
      if (newUpdate) {
        this.firebase.createFood(this.food).then(() => {
          this.cancelEvent.emit(true);
        });
      } else {
        this.firebase.updateFood(this.food).then(() => {
          this.cancelEvent.emit(true);
        });
      }
    } else {
      this.vs.validateAllFormFields(this.form);
    }
  }
  loadForm() {
    let food  = new Food();
    if (this.food) {
      food = {... this.food} as Food;
    }
    this.form = this.fb.group({
      name: [food.name, Validators.required],
      carb: [food.carb, Validators.required],
      fat: [food.fat, Validators.required],
      protein: [food.protein, Validators.required],
      serving: [food.serving.metric, Validators.required],
      servings: [food.serving.amount, Validators.required]
    });
    if (this.food) {
      this.vs.validateAllFormFields(this.form);
    }
  }
  reset() {
    this.loadForm();
    this.cancelEvent.emit(true);
  }
  isFieldInvalid(field: string) {
    return this.vs.isFieldInvalid(this.form, field);
  }
  isFieldValid(field: string) {
    return this.vs.isFieldValid(this.form, field);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.food && changes.food.currentValue !== changes.food.previousValue) {
      this.food = changes.food.currentValue;
      this.loadForm();
    }
  }
}
