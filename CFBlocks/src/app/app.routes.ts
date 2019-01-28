import { Routes } from '@angular/router';
import {HomeComponent} from './containers/home/home.component';
import {UserAccountComponent} from "./component/userAccount/userAccount.component";
import {BlockCalculatorComponent} from "./containers/block-calculator/block-calculator.component";
import {MealBuilderComponent} from "./component/mealBuilder/mealBuilder.component";
import {AdminComponent} from "./containers/admin/admin.component";
import {SigninComponent} from "./containers/signin/signin.component";
import {SignupComponent} from "./containers/signup/signup.component";
import {MealCalendarComponent} from "./containers/meal-calendar/meal-calendar.component";
import {MealEditorComponent} from "./component/mealBuilder/mealEditor/mealEditor.component";
import {FoodCreatorComponent} from "./component/mealBuilder/food-creator/food-creator.component";

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'account', component: UserAccountComponent},
  { path: 'block-calculator', component: BlockCalculatorComponent },
  { path: 'meal-calendar', component: MealCalendarComponent },
  { path: 'meal-builder/:date', component: MealBuilderComponent },
  { path: 'meal-builder/:date/meal/:meal', component: MealEditorComponent },
  { path: 'meal-builder/:date/meal/:meal/food/:food', component: FoodCreatorComponent },
  { path: '**', redirectTo: '/home' },
];
