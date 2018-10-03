import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FoodFilterPipe, MealBuilderComponent} from './mealBuilder.component';
import {FoodItemComponent} from './food-item/food-item.component';
import {FoodCreatorComponent} from './food-creator/food-creator.component';
import {MealEditorComponent} from './mealEditor/mealEditor.component';
import {MealFoodItemComponent} from './mealFood-item/mealFood-item.component';

@NgModule({
  declarations: [
    MealBuilderComponent,
    FoodFilterPipe,
    FoodItemComponent,
    FoodCreatorComponent,
    MealEditorComponent,
    MealFoodItemComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    MealBuilderComponent,
    FoodItemComponent,
    FoodCreatorComponent,
    MealEditorComponent,
    MealFoodItemComponent
  ],
  providers: []
})
export class MealBuilderModule { }
