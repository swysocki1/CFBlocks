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
            <img [src]="food.image" class="img-fluid" style="width: 2em;height:auto;" *ngIf="food.image"/>
            <i class="fa fa-fw fa-2x fa-leaf" *ngIf="!food.image"></i>
            <span>{{food.name}}</span>
            <span class="rounded-circle coal grey1-fill grey3-fill-hover pull-left update-food pointer" title="Update Food"
                  (click)="loadFoodModal()"><i class="fa fa-lg fa-fw fa-plus"></i></span>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="row">
              <div class="col-3">Serving: {{food.serving}}</div>
              <div class="col-2">Carbs: {{food.carb}}g</div>
              <div class="col-2">Fats: {{food.fat}}g</div>
              <div class="col-2">Protein: {{food.protein}}g</div>
              <div class="col-3">Calories: {{calcCalories(food)}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .update-food{
      display:inline-block;
      padding:6px;
      opacity: 0.3;
    }
    .update-food:hover {
      opacity:1;
    }
  `]
})
export class FoodItemComponent {
  @Input() food: Food;
  @Output() updateFood: EventEmitter<Food> = new EventEmitter<Food>();
  constructor(private bc: BlockCalculatorService) { }
  calcCalories(food: Food) {
    return this.bc.calcFoodCalories(food);
  }
  loadFoodModal() {
    this.updateFood.emit(this.food);
  }
}
