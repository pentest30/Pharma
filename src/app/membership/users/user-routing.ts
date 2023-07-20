

import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';
import { UserListComponent } from './user-list/user-list.component';
import { AuthGuard } from 'src/app/services/auth.guard';
import { UserAddComponent } from './user-add/user-add.component';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'user-list',
      pathMatch: 'full'
    },
    {
      path: 'user-list',
      component: UserListComponent,
      canActivate:[AuthGuard]
    }
    
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class UserRouting {
      
  }