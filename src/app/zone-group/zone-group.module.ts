import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZoneGroupRoutingModule } from './zone-group-routing.module';
import { ZoneGroupListComponent } from './zone-group-list/zone-group-list.component';
import { ZoneGroupAddComponent } from './zone-group-add/zone-group-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../shared/material-module';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [ZoneGroupListComponent, ZoneGroupAddComponent],
  imports: [
    CommonModule,
    ZoneGroupRoutingModule,
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
export class ZoneGroupModule { }
