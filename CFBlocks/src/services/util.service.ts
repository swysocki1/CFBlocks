import {Injectable} from '@angular/core';

@Injectable()
export class UtilService {
  isBlank(value) {
    if (value && value.trim()) {
      return value.trim();
    }
    return '';
  }
  isMobileSafari() {
    const userAgent = window.navigator.userAgent;
    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
      return true;
    }
    else {
      return false;
    }
  }
}
