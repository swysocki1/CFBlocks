import {Food, Meal} from '../../models/meal.module';
import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {ValidationService} from '../../services/validation.service';

@Pipe({
  name: 'foodFilter'
})
export class FoodFilterPipe implements PipeTransform {
  transform(items: [Food], search: string, alreadyUsed: [Food], favFoods: [string]): [Food] {
    console.log(items, alreadyUsed, favFoods);
    if (!items || items.length < 1) {
      return items;
    }
    items = items.filter(item => !alreadyUsed.some(food => food.name === item.name)) as [Food];
    if (search) {
      search = search.toLowerCase();
      items = items.filter(item => item.name.toLowerCase().indexOf(search) >= 0) as [Food];
    }
    if (favFoods && favFoods.length > 0) {
      const favCount = items.filter(item => favFoods.some(fav => fav === item.id)).length;
      const favItems = this.sortByIfFav(items, favFoods).slice(0, favCount) as [Food];
      const nonFavItems = this.sortByIfFav(items, favFoods).slice(favCount) as [Food];
      return [].concat(this.sortByName(favItems), this.sortByName(nonFavItems)) as [Food];
    } else {
      return this.sortByName(items);
    }
  }
  sortByIfFav(items: [Food], favs: [string]) {
    return items.sort((f1, f2) => {
      return this.sortByIfFavFunction(f1, f2, favs);
    }) as [Food];
  }
  sortByIfFavFunction(f1: Food, f2: Food, favs: [string]) {
    if (favs.some(fav => fav === f1.id) && !favs.some(fav => fav === f2.id)) {
      return -1;
    } else if (!favs.some(fav => fav === f1.id) && favs.some(fav => fav === f2.id)) {
      return 1;
    } else {
      return 0;
    }
  }
  sortByName(items: [Food]) {
    return items.sort((f1, f2) => {
      return this.sortByNameFunction(f1, f2);
    }) as [Food];
  }
  sortByNameFunction(f1: Food, f2: Food) {
    if (f1.name > f2.name) {
      return 1;
    }
    if (f1.name > f2.name) {
      return -1;
    }
    return 0;
  }
}
@Pipe({
  name: 'mealFilter'
})
export class MealFilterPipe implements PipeTransform {
  transform(items: [Meal], search: string, favMeals: [string]): [Meal] {
    if (!items || items.length < 1) {
      return items;
    }
    if (search) {
      search = search.toLowerCase();
      items = items.filter(item => item.name.toLowerCase().indexOf(search) >= 0) as [Meal];
    }
    if (favMeals && favMeals.length > 0) {
      const favCount = items.filter(item => favMeals.some(fav => fav === item.id)).length;
      const favItems = this.sortByIfFav(items, favMeals).slice(0, favCount) as [Meal];
      const nonFavItems = this.sortByIfFav(items, favMeals).slice(favCount) as [Meal];
      return [].concat(this.sortByName(favItems), this.sortByName(nonFavItems)) as [Meal];
    } else {
      return this.sortByName(items);
    }
  }
  sortByIfFav(items: [Meal], favs: [string]) {
    return items.sort((f1, f2) => {
      return this.sortByIfFavFunction(f1, f2, favs);
    }) as [Meal];
  }
  sortByIfFavFunction(f1: Meal, f2: Meal, favs: [string]) {
    if (favs.some(fav => fav === f1.id) && !favs.some(fav => fav === f2.id)) {
      return -1;
    } else if (!favs.some(fav => fav === f1.id) && favs.some(fav => fav === f2.id)) {
      return 1;
    } else {
      return 0;
    }
  }
  sortByName(items: [Meal]) {
    return items.sort((f1, f2) => {
      return this.sortByNameFunction(f1, f2);
    }) as [Meal];
  }
  sortByNameFunction(f1: Meal, f2: Meal) {
    if (f1.name > f2.name) {
      return 1;
    }
    if (f1.name > f2.name) {
      return -1;
    }
    return 0;
  }
}
@NgModule({
  declarations: [
    FoodFilterPipe,
    MealFilterPipe
  ],
  exports: [
    FoodFilterPipe,
    MealFilterPipe
  ]
})
export class FoodFilterPipeModule { }
