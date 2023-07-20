import { ListsListComponent } from '../lists/lists-list/lists-list.component';
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'lists-list',
      pathMatch: 'full'
    },
    {
      path: 'lists-list',
      component: ListsListComponent
    },
   
    
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ListRouting {
      
  }