import { ListRouting } from './list-routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListsListComponent } from '../lists/lists-list/lists-list.component';

import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { ListsAddComponent } from './lists-add/lists-add.component';
import { MaterialModule } from '../shared/material-module';


@NgModule({
  declarations: [ListsListComponent, ListsAddComponent],
  imports: [
    CommonModule,
    ListRouting,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule ,
    MatSlideToggleModule,
    MatSelectModule, 
    MatIconModule, 
    MatButtonModule,
    MatSortModule,
    MatMenuModule,
    MaterialModule
  ]
})
export class ListsModule { }
