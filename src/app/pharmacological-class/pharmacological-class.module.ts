import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { PharmacologicalClassRouting } from './pharmacological-class-routing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PharmacologicalClassListComponent } from './pharmacological-class-list/pharmacological-class-list.component';
import { PharmacologicalService } from '../services/pharmacological-class.service';
import { PharmacologicalClassAddComponent } from './pharmacological-class-add/pharmacological-class-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MaterialModule } from '../shared/material-module';

@NgModule({
  declarations: [ PharmacologicalClassListComponent, PharmacologicalClassAddComponent],
  providers : [PharmacologicalService],
  imports: [
    CommonModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule ,
    MatSlideToggleModule,
    MatSortModule, 
    MatInputModule, 
    MatButtonModule,
    MatSortModule,
    PharmacologicalClassRouting,
    MatPaginatorModule,
    MatIconModule,
    MaterialModule
  ]
})
export class PharmacologicalClassModule  { }
