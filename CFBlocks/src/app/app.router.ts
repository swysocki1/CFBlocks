import {Routes} from "@angular/router";
import {HomeComponent} from "./containers/home/home.component";
import {MealCalendarComponent} from "./containers/meal-calendar/meal-calendar.component";
import {BlockCalculatorComponent} from "./containers/block-calculator/block-calculator.component";
import {AdminComponent} from "./containers/admin/admin.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'block-calculator', component: BlockCalculatorComponent },
  { path: 'meal-calendar', component: MealCalendarComponent }
];
