import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TherapeuticClassService } from 'src/app/services/therapeutic-class-service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TherapeuticClassListComponent } from './therapeutic-class-list/therapeutic-class-list.component';
import { TherapeuticClassRoutingModule } from './therapeutic-class-routing';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { TherapeuticClassAddComponent } from './therapeutic-class-add/therapeutic-class-add.component';
import { MaterialModule } from '../shared/material-module';



@NgModule({
  declarations: [TherapeuticClassListComponent, TherapeuticClassAddComponent],
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
    MatSortModule, 
    MatInputModule, 
    MatButtonModule,
    MatSortModule,
    TherapeuticClassRoutingModule,
    MatPaginatorModule,
    MatIconModule, 
    MaterialModule
  ],
  providers : [TherapeuticClassService]
})
export class TherapeuticClassModule { }
