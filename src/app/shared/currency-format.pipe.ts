import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(value: number, currency: string): unknown {
    const formatConfig = {
      style: "currency",
      currency: currency, // CNY for Chinese Yen, EUR for Euro
      minimumFractionDigits: 2,
      currencyDisplay: "symbol",
    };
    
    // setup formatters
    const britishNumberFormatter = new Intl.NumberFormat("fr-Fr", formatConfig);
    return britishNumberFormatter.format(value);
  }

}
