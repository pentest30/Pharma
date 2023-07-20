import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionTypeRoutingModule } from './transaction-type-routing.module';
import { TransactionTypeListComponent } from './transaction-type-list/transaction-type-list.component';
import { TransactionTypeAddComponent } from './transaction-type-add/transaction-type-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { PipesModule } from '../pipes/pipes.module';
import { MaterialModule } from '../shared/material-module';


@NgModule({
  declarations: [TransactionTypeListComponent, TransactionTypeAddComponent],
  imports: [
    CommonModule,
    TransactionTypeRoutingModule,
    FormsModule,
    PipesModule,
    MaterialModule,
    MatIconModule,
    ReactiveFormsModule, 
    MatSelectInfiniteScrollModule, 
    NgSelectModule,
    GridAllModule,
    MatInputModule,
    MatProgressSpinnerModule
  ]
})
export class TransactionTypeModule { }
