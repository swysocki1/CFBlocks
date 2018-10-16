import {Food} from '../../models/meal.module';
import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {ValidationService} from '../../services/validation.service';

@Pipe({
  name: 'foodFilter'
})
export class FoodFilterPipe implements PipeTransform {
  constructor(private vs: ValidationService) {}
  transform(items: [Food], search: string, alreadyUsed: [Food]): [Food] {
    if (!items || items.length < 1) {
      return items;
    }
    items = items.filter(item => !alreadyUsed.some(food => food.name === item.name)) as [Food];
    if (search) {
      search = search.toLowerCase();
      items = items.filter(item => item.name.toLowerCase().indexOf(search) >= 0) as [Food];
    }
    return items.sort((f1, f2) => {
      if (f1.name > f2.name) {
        return 1;
      }
      if (f1.name > f2.name) {
        return -1;
      }
      return 0;
    }) as [Food];
  }
}
@NgModule({
  declarations: [
    FoodFilterPipe
  ],
  exports: [FoodFilterPipe]
})
export class FoodFilterPipeModule { }
