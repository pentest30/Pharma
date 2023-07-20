import { PickingZoneListComponent } from './picking-zone-list/picking-zone-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../services/auth.guard';
const routes: Routes = [
    {
      path: '',
      redirectTo: 'picking-zone-list',
      pathMatch: 'full'
    },
    {
      path: 'picking-zone-list',
      component: PickingZoneListComponent, 
      canActivate:[AuthGuard]
    },
    
    
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class PickingRoutingModule { }
  