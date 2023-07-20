import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneListComponent } from './phone-list/phone-list.component';
import { PhoneAddComponent } from './phone-add/phone-add.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { NgxMatIntlTelInputModule } from 'ngx-mat-intl-tel-input';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [PhoneListComponent, PhoneAddComponent],
  exports: [PhoneListComponent, PhoneAddComponent],
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
    NgxMatIntlTelInputModule,
    NgSelectModule
  ]
})
export class PhoneModule { }
