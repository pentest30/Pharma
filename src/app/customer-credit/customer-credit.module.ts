import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerCreditRoutingModule } from './customer-credit-routing.module';
import { AddCustomerCreditComponent } from './add-customer-credit/add-customer-credit.component';
import { CustomerCreditListComponent } from './customer-credit-list/customer-credit-list.component';
import { PipesModule } from '../pipes/pipes.module';
import { MaterialModule } from '../shared/material-module';
import { InvoiceCustomerComponent } from './invoice-customer/invoice-customer.component';
import { AddLineCreditNoteComponent } from './add-line-credit-note/add-line-credit-note.component';
import { CustomerCreditDetailComponent } from './customer-credit-detail/customer-credit-detail.component';


@NgModule({
  declarations: [AddCustomerCreditComponent, CustomerCreditListComponent, InvoiceCustomerComponent, AddLineCreditNoteComponent, CustomerCreditDetailComponent],
  imports: [
    CommonModule,
    CustomerCreditRoutingModule,
    PipesModule,
    MaterialModule,
  ]
})
export class CustomerCreditModule { }
