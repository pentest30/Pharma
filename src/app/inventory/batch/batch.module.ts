import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchListComponent } from './batch-list/batch-list.component';
import { BatchRouting } from './batch.routing';
import { MaterialModule } from 'src/app/shared/material-module';
import { PipesModule } from 'src/app/pipes/pipes.module';



@NgModule({
  providers: [],
  declarations: [BatchListComponent],
  imports: [
    CommonModule,
    BatchRouting,
    PipesModule,
    MaterialModule
  ]
})
export class BatchModule { }
