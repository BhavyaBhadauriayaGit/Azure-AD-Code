import { Pipe, PipeTransform } from '@angular/core';
import { IVerificationHistory } from '../HomePage/IVerificationHistory';


@Pipe({
    name: 'searchfilter'
})

export class Searchfilterpipe implements PipeTransform {

transform(items: IVerificationHistory [], filter: any, defaultFilter: boolean): IVerificationHistory [] {
    if (!filter) {
      return items;
    }

    if (!Array.isArray(items)) {
      return items;
    }

    if (filter && Array.isArray(items)) {
      const filterKeys = Object.keys(filter);

      if (defaultFilter) {
        return items.filter(item =>
            filterKeys.reduce((x, keyName) =>
                (x && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] === '', true));
      }
      else {
        return items.filter(item => {
          return filterKeys.some((keyName) => {
            return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] === '';
          });
        });
      }
    }
  }
}
