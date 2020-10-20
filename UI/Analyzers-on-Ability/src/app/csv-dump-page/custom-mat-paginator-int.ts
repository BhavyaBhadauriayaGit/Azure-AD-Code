
import {MatPaginatorIntl} from '@angular/material';
import {Injectable} from '@angular/core';
import { start } from 'repl';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  constructor() {
    super();  

    this.getAndInitTranslations();
  }

  getAndInitTranslations() {
   
   
  }

  


 getRangeLabel = (page: number, pageSize: number, length: number) =>  {
    if (length === 0 || pageSize === 0) {
      return `0 of 0`;
    }
    length = Math.max(length, 1);
    //console.log(length+" hi manju :" +pageSize);
    const startIndex = page * pageSize;
  //  const totalpagenumber =pageSize +
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    //console.log(Number(length/pageSize));
    var totalnum =1;
    if( Number((length/pageSize).toFixed()) > 0){
      totalnum = Number((length/pageSize).toFixed());
    }
  
    return `${page + 1} of ${totalnum}`;
  }
}