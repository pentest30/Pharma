import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(data: any, key: string, value: string): any {
    if(!data || data.length === 0) {
      return [];
    }
    console.log(value);
    console.log(data);
    console.log(key);
    console.log(data.find(item => item[key] == value)); 
    let batchs = (data.find(item => item[key] == value)).batchs;
    // let selected = (data.find(item => item[key] == value)).selected;
    // const arr = batchs.filter(i => !selected.includes(i.internalBatchNumber))
  
    return batchs;

  }
}