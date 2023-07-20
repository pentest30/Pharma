import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../services/auth.guard';
import { FinancialTransactionListingComponent } from './financial-transaction-listing/financial-transaction-listing.component';
import { InvoiceListingComponent } from './invoice-listing/invoice-listing.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'invoices-list',
    pathMatch: 'full'
  },
  {
    path: 'invoices-list',
    component: InvoiceListingComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'financial-trans-list',
    component: FinancialTransactionListingComponent,
    canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule { }
