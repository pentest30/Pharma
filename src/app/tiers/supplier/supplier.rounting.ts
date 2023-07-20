
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';

import { AuthGuard } from 'src/app/services/auth.guard';
import { SupplierListComponent } from "./supplier-list/supplier-list.component";
import { SupplierAddComponent } from "./supplier-add/supplier-add.component";

const routes: Routes = [
    {
      path: '',
      redirectTo: 'supplier-list',
      pathMatch: 'full'
    },
    {
      path: 'supplier-list',
      component: SupplierListComponent,
      canActivate:[AuthGuard]
    },
    {
        path: 'supplier-add',
        component: SupplierAddComponent,
        canActivate:[AuthGuard]
      },
  
    
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class SupplierRouting {
      
  }