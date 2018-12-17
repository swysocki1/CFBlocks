import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MealBuilderComponent} from './mealBuilder.component';
import {FoodItemComponent} from './food-item/food-item.component';
import {FoodCreatorComponent} from './food-creator/food-creator.component';
import {MealEditorComponent} from './mealEditor/mealEditor.component';
import {MealFoodItemComponent} from './mealFood-item/mealFood-item.component';
import {MomentPipeModule} from '../../pipe/moment.pipe';
import {FoodFilterPipeModule} from '../../pipe/foodFilter.pipe';
import {MealItemComponent} from "./meal-item/meal-item.component";

@NgModule({
  declarations: [
    MealBuilderComponent,
    FoodItemComponent,
    FoodCreatorComponent,
    MealEditorComponent,
    MealFoodItemComponent,
    MealItemComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    MomentPipeModule,
    FoodFilterPipeModule
  ],
  exports: [
    MealBuilderComponent,
    FoodItemComponent,
    FoodCreatorComponent,
    MealEditorComponent,
    MealFoodItemComponent,
    MealItemComponent
  ],
  providers: []
})
export class MealBuilderModule { }
