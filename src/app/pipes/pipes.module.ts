import { ThousandSuffixesPipe } from '../shared/thousandSuffixes.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyFormatPipe } from '../shared/currency-format.pipe';
import { ToFixedPipe } from '../shared/to-fixed.pipe';
import { NumberSeparatorPipe } from '../shared/numberSeparator.pipe';
import { FilterPipe } from '../shared/filter.pipe';
import { JoinPipe } from '../shared/JoinPipe';



@NgModule({
  declarations: [CurrencyFormatPipe, ToFixedPipe,NumberSeparatorPipe,ThousandSuffixesPipe,FilterPipe,JoinPipe],
  imports: [
    CommonModule
  ],
  exports:[
    CurrencyFormatPipe,
    ToFixedPipe,
    NumberSeparatorPipe,
    ThousandSuffixesPipe,
    FilterPipe,
    JoinPipe
  ]
})
export class PipesModule { }
