import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcurmentRoutingModule } from './procurment-routing.module';
import { SupplierOrderListingComponent } from './supplier-order-listing/supplier-order-listing.component';
import { AddSupplierOrderComponent } from './add-supplier-order/add-supplier-order.component';
import { DetailSupplierOrderComponent } from './detail-supplier-order/detail-supplier-order.component';
import { PipesModule } from '../pipes/pipes.module';
import { MaterialModule } from '../shared/material-module';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { AddProductSupplierOrderComponent } from './add-product-supplier-order/add-product-supplier-order.component';
import { AddSupplierInvoiceComponent } from './add-supplier-invoice/add-supplier-invoice.component';
import { SupplierInvoiceListingComponent } from './supplier-invoice-listing/supplier-invoice-listing.component';
import { ValidSupplierOrdersComponent } from './valid-supplier-orders/valid-supplier-orders.component';
import { AddProductSupplierInvoiceComponent } from './add-product-supplier-invoice/add-product-supplier-invoice.component';
import { DeliveryReceiptListingComponent } from './delivery-receipt-listing/delivery-receipt-listing.component';
import { AddDeliveryReceiptComponent } from './add-delivery-receipt/add-delivery-receipt.component';
import { ValidSupplierInvoicesComponent } from './valid-supplier-invoices/valid-supplier-invoices.component';
import { AddProductDeliveryReceiptComponent } from './add-product-delivery-receipt/add-product-delivery-receipt.component';
import { DetailSupplierInvoiceComponent } from './detail-supplier-invoice/detail-supplier-invoice.component';
import { DetailDeliveryReceiptComponent } from './detail-delivery-receipt/detail-delivery-receipt.component';


@NgModule({
  declarations: [
    SupplierOrderListingComponent, 
    AddSupplierOrderComponent, 
    DetailSupplierOrderComponent, 
    SupplierListComponent, 
    AddProductSupplierOrderComponent, 
    AddSupplierInvoiceComponent, 
    SupplierInvoiceListingComponent, 
    ValidSupplierOrdersComponent, 
    AddProductSupplierInvoiceComponent, 
    DeliveryReceiptListingComponent, 
    AddDeliveryReceiptComponent, 
    ValidSupplierInvoicesComponent, AddProductDeliveryReceiptComponent, DetailSupplierInvoiceComponent, DetailDeliveryReceiptComponent
  ],
  imports: [
    CommonModule,
    ProcurmentRoutingModule,
    PipesModule,
    MaterialModule,
  ]
})
export class ProcurmentModule { }
