import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventSumAddComponent } from './inventsum-add/inventsum-add.component';
import { InventSumListComponent } from './inventsum-list/inventsum-list.component';
import { InventSumRouting } from './inventsum.routing';
import { TransactionListingComponent } from './transaction-listing/transaction-listing.component';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MaterialModule } from 'src/app/shared/material-module';
import { ArrivalListComponent } from './arrival-list/arrival-list.component';
import { ResevedQntListComponent } from './reseved-qnt-list/reseved-qnt-list.component';




@NgModule({
  providers: [],
  declarations: [InventSumAddComponent, InventSumListComponent,TransactionListingComponent, ArrivalListComponent, ResevedQntListComponent],
  imports: [
    CommonModule,
    InventSumRouting,
    PipesModule,
    MaterialModule
  ]
})
export class InventSumModule { }
