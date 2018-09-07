import {Injectable} from "@angular/core";
import {User} from "../models/user.model";
import {Observable} from "rxjs/Observable";
import {Notification} from "../models/notification.model";

@Injectable()
export class NotificationService {
  private notifications: Observable<Notification> = new Observable<Notification>();
  getNotifications(user: User): Observable<Notification> { //TODO need to correct how to emit
    return new Observable<Notification>(subscriber => {
      let notification = new Notification();
      notification.id = '1';
      notification.created = new Date();
      notification.message = 'New Notification TEST';
      notification.type = 'alert';
      notification.viewed = false;
      subscriber.next(notification);
      subscriber.complete();
    });
  }
}
