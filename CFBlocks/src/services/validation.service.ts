import {Injectable} from '@angular/core';
import {Meal} from '../models/meal.module';
import {FormControl, FormGroup} from '@angular/forms';

@Injectable()
export class ValidationService {
  isEmail(email: any) {
    if(email && typeof email === 'string') {
      const re = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-]){0,}@[a-zA-Z0-9-]+\.([a-zA-Z]{1,6}\.)?[a-zA-Z]{2,6}$/;
      return re.test(String(email).toLowerCase());
    } else {
      return false;
    }
  }
  usernameExists(username): boolean {
    return false;
  }
  passwordStrength(password: any): string {
    /**
     *
     *  GOTTEN FROM : https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
     */
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    const medium = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
    if (password && typeof password === 'string') {
      if (strong.test(password)) {
        return 'STRONG';
      }
      if (medium.test(password)) {
        return 'MEDIUM';
      }
    }
    return 'WEAK';
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  isFieldInvalid(form: FormGroup, field: string) {
    return !form.get(field).valid && form.get(field).touched;
  }
  isFieldValid(form: FormGroup, field: string) {
    return form.get(field).valid;
  }
  compareMeals(a: Meal, b: Meal): number {
    return this.mealTypeToValue(a.type) > this.mealTypeToValue(b.type) ? 1 : -1;
  }
  private mealTypeToValue(mealType: string) {
    if (mealType) {
      if (mealType.toUpperCase() === 'BREAKFAST') {
        return 1;
      } else if (mealType.toUpperCase() === 'LUNCH') {
        return 2;
      } else if (mealType.toUpperCase() === 'DINNER') {
        return 3;
      } else if (mealType.toUpperCase() === 'SNACK') {
        return 4;
      } else {
        return 5;
      }
    } else {
      return 5;
    }
  }
  passwordQualifications = '--- List of requirements for password should be here ---';
}
