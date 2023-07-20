import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvailableProductsComponent } from '../sales/available-products/available-products.component';
import { AvailableQntListComponent } from './available-qnt-list/available-qnt-list.component';
import { QuotaListComponent } from './quota-list/quota-list.component';
import { QuotaReceivedListComponent } from './quota-received-list/quota-received-list.component';
import { QuotaRequestListComponent } from './quota-request-list/quota-request-list.component';
import { QuotaSsrsComponent } from './quota-ssrs/quota-ssrs.component';
import { SupervisorTransferListComponent } from './supervisor-transfer-list/supervisor-transfer-list.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'quota-list',
    pathMatch: 'full'
  },
  {
    path: 'quota-list',
    component: QuotaListComponent
  },
  {
    path: 'quota-request-list',
    component: QuotaRequestListComponent
  },
  {
    path: 'quota-received-list',
    component: QuotaReceivedListComponent
  },
  {
    path: 'available-qnt-list',
    component: AvailableQntListComponent
  },{
    path: 'ssrs-report',
    component: QuotaSsrsComponent
  },
  {
    path: 'supervisor-transfer-list',
    component: SupervisorTransferListComponent
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotaRoutingModule { }
