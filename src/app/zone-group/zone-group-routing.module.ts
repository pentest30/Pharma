import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZoneGroupListComponent } from './zone-group-list/zone-group-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'zone-group-list',
    pathMatch: 'full'
  },
  {
    path: 'zone-group-list',
    component: ZoneGroupListComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZoneGroupRoutingModule { }
