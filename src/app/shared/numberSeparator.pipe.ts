import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberSeparator'
})
export class NumberSeparatorPipe implements PipeTransform {

  transform(value: number): unknown {
   return value.toLocaleString('fr-FR', {maximumFractionDigits: 2});
  }

}