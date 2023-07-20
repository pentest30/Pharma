import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressAddComponent } from './address-add/address-add.component';
import { AddressListComponent } from './address-list/address-list.component';
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
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [AddressAddComponent, AddressListComponent],
  exports : [AddressAddComponent, AddressListComponent],
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
    MatIconModule,
    NgSelectModule
  ]
})
export class AddressModule { }
