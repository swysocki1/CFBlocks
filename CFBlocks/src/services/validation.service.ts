import {Injectable} from '@angular/core';

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
  passwordQualifications = '--- List of requirements for password should be here ---';
}
