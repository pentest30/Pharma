import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../services/auth.guard';
import { AddCustomerCreditComponent } from './add-customer-credit/add-customer-credit.component';
import { CustomerCreditDetailComponent } from './customer-credit-detail/customer-credit-detail.component';
import { CustomerCreditListComponent } from './customer-credit-list/customer-credit-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'customer-credit-list',
    pathMatch: 'full'
  },
  {
    path: 'customer-credit-list',
    component: CustomerCreditListComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'add-customer-credit',
    component: AddCustomerCreditComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'customer-credit-detail',
    component: CustomerCreditDetailComponent,
    canActivate:[AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerCreditRoutingModule { }
