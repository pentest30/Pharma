import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxGroupListComponent } from './tax-group-list/tax-group-list.component';
const routes: Routes = [
    {
      path: '',
      redirectTo: 'tax-group-list',
      pathMatch: 'full'
    },
    {
      path: 'tax-group-list',
      component: TaxGroupListComponent
    },
    
    
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class TaxGroupRoutingModule { }
  