import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailProductListComponent } from './detail-product-list/detail-product-list.component';
import { PipesModule } from '../pipes/pipes.module';
import { MaterialModule } from '../shared/material-module';
import { BillingModule } from '../billing/billing.module';
import { ReportingRoutingModule } from './reporting-routing.module';
import { AllReservedQntComponent } from './all-reserved-qnt/all-reserved-qnt.component';
import { TurnoverCustomersComponent } from './turnover-customers/turnover-customers.component';
import { AllDebtListComponent } from './all-debt-list/all-debt-list.component';



@NgModule({
  declarations: [DetailProductListComponent, AllReservedQntComponent, TurnoverCustomersComponent, AllDebtListComponent],
  imports: [
    CommonModule,
    PipesModule,
    MaterialModule, 
    ReportingRoutingModule,
    BillingModule
  ]
})
export class ReportingModule { }
