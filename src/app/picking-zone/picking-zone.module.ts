import { PickingRoutingModule } from './picking-routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickingZoneListComponent } from './picking-zone-list/picking-zone-list.component';
import { PickingZoneAddComponent } from './picking-zone-add/picking-zone-add.component';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../shared/material-module';

@NgModule({
  declarations: [PickingZoneListComponent, PickingZoneAddComponent],
  imports: [
    CommonModule,
    PickingRoutingModule,
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
    MatSelectModule, 
    MatIconModule, 
    MatButtonModule,
    MatSortModule,
    MatMenuModule,
    NgSelectModule,
    MaterialModule

  ]
})
export class PickingZoneModule { }
