import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';
import { FormListComponent } from './form-list/form-list.component';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'form-list',
      pathMatch: 'full'
    },
    {
      path: 'form-list',
      component: FormListComponent
    },
   
    
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class FormRouting {
      
  }