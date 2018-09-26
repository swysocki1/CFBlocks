import {Routes} from '@angular/router';
import {HomeComponent} from './containers/home/home.component';
import {MealCalendarComponent} from './containers/meal-calendar/meal-calendar.component';
import {BlockCalculatorComponent} from './containers/block-calculator/block-calculator.component';
import {AdminComponent} from './containers/admin/admin.component';
import {SigninComponent} from './containers/signin/signin.component';
import {UserAccountComponent} from './component/userAccount/userAccount.component';
import {SignupComponent} from './containers/signup/signup.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'account', component: UserAccountComponent},
  { path: 'block-calculator', component: BlockCalculatorComponent },
  { path: 'meal-calendar', component: MealCalendarComponent },
  { path: '**', redirectTo: '/home' }
];
