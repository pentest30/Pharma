import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../services/auth.guard';
import { AddOrderComponent } from './add-order/add-order.component';
import { AllPendingOrdersComponent } from './all-pending-orders/all-pending-orders.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { SalesPersonOrdersListComponent } from './sales-person-orders-list/sales-person-orders-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders-list',
    pathMatch: 'full'
  },
  {
    path: 'add-order',
    component: AddOrderComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'order-detail',
    component: OrderDetailComponent,
    data : {id : ''},
    canActivate:[AuthGuard]
  },
  {
    path: 'sales-person-orders',
    component: SalesPersonOrdersListComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'all-pending-orders',
    component: AllPendingOrdersComponent,
    canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
