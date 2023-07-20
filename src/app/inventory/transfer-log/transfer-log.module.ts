import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransferLogListComponent } from './transfer-log-list/transfer-log-list.component';
import { InventRoutingModule } from './transfer-log-routing';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MaterialModule } from 'src/app/shared/material-module';
import { TransfetLogAddComponent } from './transfet-log-add/transfet-log-add.component';
import { TransferInventAddComponent } from './transfer-invent-add/transfer-invent-add.component';



@NgModule({
  declarations: [TransferLogListComponent, TransfetLogAddComponent, TransferInventAddComponent],
  imports: [
    CommonModule,
    InventRoutingModule,
    PipesModule,
    MaterialModule
  ]
})
export class TransferLogModule { }
