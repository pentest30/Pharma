import { PackagingLisComponent } from './packaging-lis/packaging-lis.component';
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'packaging-list',
      pathMatch: 'full'
    },
    {
      path: 'packaging-list',
      component: PackagingLisComponent
    },
   
    
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class PackagingRouting {
      
  }