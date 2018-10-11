import {NgModule, Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'dateFormat' })
export class MomentPipe implements PipeTransform {
  transform(value: Date | moment.Moment, dateFormat: string): any {
    return moment(value).format(dateFormat);
  }
}
@NgModule({
  declarations: [
    MomentPipe
  ],
  exports: [MomentPipe]
})
export class MomentPipeModule { }
