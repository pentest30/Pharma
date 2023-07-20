import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../services/auth.guard';
import { AddDiscountComponent } from './add-discount/add-discount.component';
import { DiscountListComponent } from './discount-list/discount-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders-list',
    pathMatch: 'full'
  },
  {
    path: 'discount-list',
    component: DiscountListComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'add-discount',
    component: AddDiscountComponent,
    canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscountsRoutingModule { }
