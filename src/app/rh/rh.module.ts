import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingEmployeeComponent } from './employee/listing-employee/listing-employee.component';
import { EmployeeAddComponent } from './employee/employee-add/employee-add.component';
import { PipesModule } from '../pipes/pipes.module';
import { MaterialModule } from '../shared/material-module';
import { RhRoutingModule } from './rh-routing.module';



@NgModule({
  declarations: [ListingEmployeeComponent, EmployeeAddComponent],
  imports: [
    CommonModule,
    RhRoutingModule,
    PipesModule,
    MaterialModule
  ]
})
export class RhModule { }
