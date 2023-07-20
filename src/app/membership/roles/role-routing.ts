

import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';

import { AuthGuard } from 'src/app/services/auth.guard';
import { RoleListComponent } from './role-list/role-list.component';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'role-list',
      pathMatch: 'full'
    },
    {
      path: 'role-list',
      component: RoleListComponent,
      canActivate:[AuthGuard]
    },
  
    
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class RoleRouting {
      
  }