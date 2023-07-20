import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../services/auth.guard';
import { AddDeliveryReceiptComponent } from './add-delivery-receipt/add-delivery-receipt.component';
import { AddSupplierInvoiceComponent } from './add-supplier-invoice/add-supplier-invoice.component';
import { AddSupplierOrderComponent } from './add-supplier-order/add-supplier-order.component';
import { DeliveryReceiptListingComponent } from './delivery-receipt-listing/delivery-receipt-listing.component';
import { DetailSupplierOrderComponent } from './detail-supplier-order/detail-supplier-order.component';
import { SupplierInvoiceListingComponent } from './supplier-invoice-listing/supplier-invoice-listing.component';
import { SupplierOrderListingComponent } from './supplier-order-listing/supplier-order-listing.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'supplier-orders-list',
    pathMatch: 'full'
  },
  {
    path: 'supplier-orders-list',
    component: SupplierOrderListingComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'add-supplier-order',
    component: AddSupplierOrderComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'order-detail',
    component: DetailSupplierOrderComponent,
    data : {id : ''},
    canActivate:[AuthGuard]
  },
  {
    path: 'supplier-invoices-list',
    component: SupplierInvoiceListingComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'add-supplier-invoice',
    component: AddSupplierInvoiceComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'delivery-receipt-list',
    component: DeliveryReceiptListingComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'add-delivery-receipt',
    component: AddDeliveryReceiptComponent,
    canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcurmentRoutingModule { }
