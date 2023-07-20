import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { Dashboard3Component } from './dashboard3/dashboard3.component';
import { AuthGuard } from '../services/auth.guard';
import { RequestLogComponent } from './request-log/request-log.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: 'main',
    component: MainComponent, 
    canActivate :[AuthGuard]
  },
  {
    path: 'dashboard2',
    component: Dashboard2Component
  },
  {
    path: 'dashboard3',
    component: Dashboard3Component
  },  
  {
    path: 'request-log',
    component: RequestLogComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
