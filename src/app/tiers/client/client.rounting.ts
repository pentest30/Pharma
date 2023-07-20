
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';

import { AuthGuard } from 'src/app/services/auth.guard';
import { ClientListComponent } from "./client-list/client-list.component";
import { ClientAddComponent } from "./client-add/client-add.component";

const routes: Routes = [
    {
      path: '',
      redirectTo: 'client-list',
      pathMatch: 'full'
    },
    {
      path: 'client-list',
      component: ClientListComponent,
      canActivate:[AuthGuard]
    },
    {
        path: 'client-add',
        component: ClientAddComponent,
        canActivate:[AuthGuard]
      },
  
    
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ClientRouting {
      
  }