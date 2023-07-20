import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscountsRoutingModule } from './discounts-routing.module';
import { DiscountListComponent } from './discount-list/discount-list.component';
import { AddDiscountComponent } from './add-discount/add-discount.component';
import { MaterialModule } from '../shared/material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommandColumnService, EditService, GridAllModule } from '@syncfusion/ej2-angular-grids';
import { PageService, SortService, FilterService, GroupService } from '@syncfusion/ej2-angular-grids';


@NgModule({
  providers: [PageService,
    SortService,
    FilterService,
    GroupService, EditService, CommandColumnService],
  declarations: [DiscountListComponent, AddDiscountComponent],
  imports: [
    CommonModule,
    DiscountsRoutingModule,
    MaterialModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule, 
    NgSelectModule ,
    GridAllModule,

  ]
})
export class DiscountsModule { }
