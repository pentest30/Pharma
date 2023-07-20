import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth.guard';
import { InventListComponent } from './invent-list/invent-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'invent-list',
    pathMatch: 'full'
  },
  {
    path: 'invent-list',
    component: InventListComponent,
    canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventRoutingModule { }
