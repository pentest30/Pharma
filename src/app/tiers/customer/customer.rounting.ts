
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';

import { AuthGuard } from 'src/app/services/auth.guard';
import { CustomerListComponent } from "./customer-list/customer-list.component";
import { CustomerAddComponent } from "./customer-add/customer-add.component";
import { CustomerEditComponent } from "./customer-edit/customer-edit.component";

const routes: Routes = [
    {
      path: '',
      redirectTo: 'customer-list',
      pathMatch: 'full'
    },
    {
      path: 'customer-list',
      component: CustomerListComponent,
      canActivate:[AuthGuard]
    },
    {
        path: 'customer-add',
        component: CustomerAddComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'customer-edit',
        component: CustomerEditComponent,
        canActivate:[AuthGuard]
      },
    
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class CustomerRouting {
      
  }