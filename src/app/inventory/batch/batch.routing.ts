
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';

import { AuthGuard } from 'src/app/services/auth.guard';
import { BatchListComponent } from "./batch-list/batch-list.component";



const routes: Routes = [
    {
      path: '',
      redirectTo: 'batch-list',
      pathMatch: 'full'
    },
    {
      path: 'batch-list',
      component: BatchListComponent,
      canActivate:[AuthGuard]
    }
    
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class BatchRouting {
      
  }