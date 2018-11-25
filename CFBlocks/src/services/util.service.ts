import {Injectable} from '@angular/core';

@Injectable()
export class UtilService {
  isBlank(value) {
    if (value && value.trim()) {
      return value.trim();
    }
    return '';
  }
  isMobile() {
    return window.navigator.userAgent.match(/mobile/i);
  }
}
