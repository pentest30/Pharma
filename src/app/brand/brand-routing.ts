import { BrandListComponent } from './brand-list/brand-list.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'brand-list',
      pathMatch: 'full'
    },
    {
      path: 'brand-list',
      component: BrandListComponent
    },
   
    
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class BrandRouting {
      
  }