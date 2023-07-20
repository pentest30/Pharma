import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventRoutingModule } from './invent-routing.module';
import { InventListComponent } from './invent-list/invent-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { NgxPrintModule } from 'ngx-print';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MaterialModule } from 'src/app/shared/material-module';


@NgModule({
  declarations: [InventListComponent],
  imports: [
    CommonModule,
    InventRoutingModule,
    PipesModule,
    MaterialModule
   
  ]
})
export class InventModule { }
