import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Food, Meal} from '../../../../models/meal.module';
import {BlockCalculatorService} from '../../../../services/block-calculator.service';

@Component({
  selector: 'food-item',
  template: `
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col">
            <div class="row">
              <div class="col">
                <div class="row">
                  <div class="col">
                    <h3>{{food.name}}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="row">
                  <div class="col">
                    <img [src]="food.image" class="img-fluid" style="width: 2em;height:auto;" *ngIf="food.image"/>
                    <i class="fa fa-fw fa-5x fa-leaf leaf-green" *ngIf="!food.image"></i>
                  </div>
                </div>
              </div>
            <!--</div>-->
            <!--<div class="row">-->
              <div class="col">
                <div class="row">
                  <div class="col">Serving: {{food.serving.amount}} {{food.serving.metric}}</div>
                </div>
                <div class="row">
                  <div class="col">Carbs: {{food.carb}}g</div>
                </div>
                <div class="row">
                  <div class="col">Fats: {{food.fat}}g</div>
                </div>
                <div class="row">
                  <div class="col">Protein: {{food.protein}}g</div>
                </div>
                <div class="row">
                  <div class="col">Calories: {{calcCalories(food)}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-1">
            <span class="rounded-circle coal grey1-fill grey3-fill-hover pull-right update-food remove pointer" title="Remove Food"
                  (click)="removeFood()" *ngIf="canRemove"><i class="fa fa-xs fa-fw fa-times"></i></span>
            <span class="rounded-circle coal grey1-fill grey3-fill-hover pull-right update-food add pointer" title="Add Food"
                  (click)="addFood()" *ngIf="canAdd"><i class="fa fa-xs fa-fw fa-plus"></i></span>
            <span class="rounded-circle coal grey1-fill grey3-fill-hover pull-right update-food edit pointer" title="Update Food"
                  (click)="loadFoodModal()" *ngIf="canUpdate"><i class="fa fa-xs fa-fw fa-pencil"></i></span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-body{ padding: 10px;}
    .update-food{
      display:inline-block;
      padding:3px;
      opacity: 0.3;
      margin-bottom: 5px;
    }
    .update-food:hover {
      opacity:1;
    }
  `]
})
export class FoodItemComponent {
  @Input() food: Food;
  @Input() canAdd: boolean;
  @Input() canUpdate: boolean;
  @Input() canRemove: boolean;
  @Output() updateFood: EventEmitter<Food> = new EventEmitter<Food>();
  @Output() add: EventEmitter<Food> = new EventEmitter<Food>();
  @Output() remove: EventEmitter<Food> = new EventEmitter<Food>();
  constructor(private bc: BlockCalculatorService) { }
  calcCalories(food: Food) {
    return this.bc.calcFoodCalories(food);
  }
  loadFoodModal() {
    this.updateFood.emit(this.food);
  }
  removeFood() {
    this.remove.emit(this.food);
  }
  addFood() {
    this.add.emit(this.food);
  }
}
