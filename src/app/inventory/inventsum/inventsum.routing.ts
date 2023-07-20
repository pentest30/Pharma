
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';

import { AuthGuard } from 'src/app/services/auth.guard';
import { InventSumListComponent } from "./inventsum-list/inventsum-list.component";
import { TransactionListingComponent } from "./transaction-listing/transaction-listing.component";
import { ArrivalListComponent } from "./arrival-list/arrival-list.component";
import { ResevedQntListComponent } from "./reseved-qnt-list/reseved-qnt-list.component";



const routes: Routes = [
    {
      path: '',
      redirectTo: 'inventsum-list',
      pathMatch: 'full'
    },
    {
      path: 'inventsum-list',
      component: InventSumListComponent,
      canActivate:[AuthGuard]
    },
    {
      path: 'arrival-list',
      component: ArrivalListComponent,
      canActivate:[AuthGuard]
    },
    {
      path: 'reseved-qnt-list',
      component: ResevedQntListComponent,
      canActivate:[AuthGuard]
    },
    {
        path: 'inventory-add',
        component: InventSumListComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'transaction-listing',
        component: TransactionListingComponent,
        canActivate:[AuthGuard]
      },
    
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class InventSumRouting {
      
  }