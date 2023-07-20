import { ProductListComponent } from './product-list/product-list.component';

import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { AuthGuard } from '../services/auth.guard';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'product-list',
      pathMatch: 'full'
    },
    {
      path: 'product-list',
      component: ProductListComponent,
      canActivate:[AuthGuard]
    },
    {
        path: 'product-add',
        component: ProductAddComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'product-edit',
        data : {id : ''},
        component: ProductEditComponent,
        canActivate:[AuthGuard]
      }
    
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ProductRouting {
      
  }