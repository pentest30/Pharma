
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DciCodeListComponent } from './dci-code-list/dci-code-list.component';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'dci-code-list',
      pathMatch: 'full'
    },
    {
      path: 'dci-code-list',
      component: DciCodeListComponent
    },
   
    
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DciCodeRouting {
      
  }