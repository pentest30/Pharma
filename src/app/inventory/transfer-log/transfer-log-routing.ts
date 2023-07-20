import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth.guard';
import { TransferLogListComponent } from './transfer-log-list/transfer-log-list.component';
import { TransfetLogAddComponent } from './transfet-log-add/transfet-log-add.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'transfer-log-list',
    pathMatch: 'full'
  },
  {
    path: 'transfer-log-list',
    component: TransferLogListComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'transfer-log-add',
    component: TransfetLogAddComponent,
    canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventRoutingModule { }
