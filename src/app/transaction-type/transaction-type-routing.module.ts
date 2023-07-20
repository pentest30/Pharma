import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionTypeListComponent } from './transaction-type-list/transaction-type-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'transaction-type-list',
    pathMatch: 'full'
  },
  {
    path: 'transaction-type-list',
    component: TransactionTypeListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionTypeRoutingModule { }
