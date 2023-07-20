import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillingRoutingModule } from './billing-routing.module';
import { InvoiceListingComponent } from './invoice-listing/invoice-listing.component';
import { PipesModule } from '../pipes/pipes.module';
import { MaterialModule } from '../shared/material-module';
import { FinancialTransactionListingComponent } from './financial-transaction-listing/financial-transaction-listing.component';
import { DetailInvoiceComponent } from './detail-invoice/detail-invoice.component';
import { InvoiceLogListComponent } from './invoice-log-list/invoice-log-list.component';
import { ProductsSalesLogComponent } from './products-sales-log/products-sales-log.component';
import { DebtLogListComponent } from './debt-log-list/debt-log-list.component';
import { InvoiceDebtDetailsComponent } from './invoice-debt-details/invoice-debt-details.component';


@NgModule({
  declarations: [InvoiceListingComponent, FinancialTransactionListingComponent, DetailInvoiceComponent, InvoiceLogListComponent, ProductsSalesLogComponent, DebtLogListComponent, InvoiceDebtDetailsComponent],
  exports : [InvoiceLogListComponent, ProductsSalesLogComponent, DebtLogListComponent],
  imports: [
    CommonModule,
    BillingRoutingModule,
    PipesModule,
    MaterialModule
  ]
})
export class BillingModule { }
