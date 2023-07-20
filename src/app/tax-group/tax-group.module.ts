import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxGroupListComponent } from './tax-group-list/tax-group-list.component';
import { TaxGroupRoutingModule } from './tax-group-routing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { TaxGroupAddComponent } from './tax-group-add/tax-group-add.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MaterialModule } from '../shared/material-module';
@NgModule({
  declarations: [TaxGroupListComponent, TaxGroupAddComponent],
  imports: [
    CommonModule,
    TaxGroupRoutingModule,
    MatTableModule,
    MatSelectModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule ,
    MatSlideToggleModule,
    MatIconModule, 
    MatButtonModule,
    MatSortModule,
   MatDatepickerModule,
    MatMenuModule,
    MaterialModule
  ]
})
export class TaxGroupModule { }
