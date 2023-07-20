import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join'
})
export class JoinPipe implements PipeTransform {
  transform(input: Array<any>, field: string,sep = ','): string {
    return input.map(_ => _[field]).join(sep);
  }
}
