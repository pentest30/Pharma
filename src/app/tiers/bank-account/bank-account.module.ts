import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankAccountListComponent } from './bank-account-list/bank-account-list.component';
import { BankAccountAddComponent } from './bank-account-add/bank-account-add.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [BankAccountListComponent, BankAccountAddComponent],
  exports : [BankAccountListComponent, BankAccountAddComponent],
  imports: [
    CommonModule,
     MatTableModule,
    MatPaginatorModule,
  
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule ,
    MatSlideToggleModule,
    MatSelectModule, 
    MatInputModule, 
    MatButtonModule,
    MatSortModule,
    MatIconModule
  ]
})
export class BankAccountModule { }
