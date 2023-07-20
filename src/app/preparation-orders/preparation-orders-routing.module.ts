import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../services/auth.guard';
import { ArchiveOpComponent } from './archive-op/archive-op.component';
import { ConsolidationListingComponent } from './consolidation-listing/consolidation-listing.component';
import { ControlledOpComponent } from './controlled-op/controlled-op.component';
import { DeleiveryOrderListingComponent } from './deleivery-order-listing/deleivery-order-listing.component';
import { ExpeditionListingComponent } from './expedition-listing/expedition-listing.component';
import { ExpeditionComponent } from './expedition/expedition.component';
import { ListingPreparationOrdersComponent } from './listing-preparation-orders/listing-preparation-orders.component';
import { OpFormControlComponent } from './op-form-control/op-form-control.component';
import { OrdersForAgentComponent } from './orders-for-agent/orders-for-agent.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'preparation-orders-list',
    pathMatch: 'full'
  },
  {
    path: 'preparation-orders-list',
    component: ListingPreparationOrdersComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'controlled-op',
    component: ControlledOpComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'form-op',
    component: OpFormControlComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'archive-op',
    component: ArchiveOpComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'consolidation-op',
    component: ConsolidationListingComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'expedition-op',
    component: ExpeditionListingComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'orders-for-agent',
    component: OrdersForAgentComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'deleivery-orders',
    component: DeleiveryOrderListingComponent,
    canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreparationOrdersRoutingModule { }
