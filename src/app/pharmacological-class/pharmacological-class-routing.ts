import { PharmacologicalClassListComponent } from './pharmacological-class-list/pharmacological-class-list.component';
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'pharmacological-class-list',
      pathMatch: 'full'
    },
    {
      path: 'pharmacological-class-list',
      component: PharmacologicalClassListComponent
    },
    
    
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class PharmacologicalClassRouting {
      
  }