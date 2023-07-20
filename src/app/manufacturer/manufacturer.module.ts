import { MatMenuModule } from '@angular/material/menu';
import { EmailModule } from './../email/email.module';
import { PhoneModule } from './../phone/phone.module';
import { AddressModule } from './../address/address.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManufacturerListComponent } from './manufacturer-list/manufacturer-list.component';
import { ManufacturerRouting } from './manufacturer-rounting';

import { ManufacturerAddComponent } from '../Manufacturer/manufacturer-add/manufacturer-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { ManufacturerEditComponent } from './manufacturer-edit/manufacturer-edit.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../shared/material-module';

@NgModule({
  declarations: [ManufacturerAddComponent, ManufacturerListComponent, ManufacturerEditComponent],
  imports: [
    CommonModule,
    ManufacturerRouting,
    AddressModule,
    PhoneModule,
    EmailModule,
    MaterialModule
  ]
})
export class ManufacturerModule{ }
