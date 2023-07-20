import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesRoutingModule } from './sales-routing.module';
import { MaterialModule } from '../shared/material-module';
import { PipesModule } from '../pipes/pipes.module';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { SalesPersonOrdersListComponent } from './sales-person-orders-list/sales-person-orders-list.component';
import { CancelOrderComponent } from './cancel-order/cancel-order.component';
import { OrderPaymentComponent } from './order-payment/order-payment.component';
import { AddOrderComponent } from './add-order/add-order.component';
import { NgbdSortableHeader } from './add-order/NgbdSortableHeader';
import { AutoFocusDirective } from './auto-focus.directive';
import { SearchProductComponent } from './search-product/search-product.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { AvailableProductsComponent } from './available-products/available-products.component';
import { AllPendingOrdersComponent } from './all-pending-orders/all-pending-orders.component';
import { BillingModule } from '../billing/billing.module';
import { OrdersListDtComponent } from './orders-list-dt/orders-list-dt.component';

@NgModule({
  providers: [
  ],
  declarations: [
    OrderDetailComponent, 
    SalesPersonOrdersListComponent, 
    CancelOrderComponent, 
    OrderPaymentComponent, 
    AddOrderComponent,
    NgbdSortableHeader,
    AutoFocusDirective,
    SearchProductComponent,
    CustomerListComponent,
    AvailableProductsComponent,
    AllPendingOrdersComponent,
    OrdersListDtComponent,
  ],
  exports : [OrdersListDtComponent],
  imports: [
    CommonModule,
    SalesRoutingModule,
    PipesModule,
    MaterialModule,
    BillingModule
    
  ]
})
export class SalesModule { }
