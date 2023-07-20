import { DciListComponent } from './dci-list/dci-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'dci-list',
      pathMatch: 'full'
    },
    {
      path: 'dci-list',
      component: DciListComponent
    },
   
    
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DciRouting {
      
  }