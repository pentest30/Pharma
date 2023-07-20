import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainComponent } from './main/main.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { Dashboard3Component } from './dashboard3/dashboard3.component';
import { ChartsModule as chartjsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { GaugeModule } from 'angular-gauge';
import { CommandColumnService, EditService, FilterService, GridAllModule, GroupService, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { PipesModule } from '../pipes/pipes.module';
import { RequestLogComponent } from './request-log/request-log.component';
import { MaterialModule } from '../shared/material-module';

@NgModule({
  providers: [PageService,
    SortService,
    FilterService,
    GroupService, EditService, CommandColumnService],
  declarations: [MainComponent, Dashboard2Component, Dashboard3Component, RequestLogComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    PipesModule,
    chartjsModule,
    NgxEchartsModule,
    GridAllModule,
    GaugeModule.forRoot(),
    MaterialModule
  ]
})
export class DashboardModule {}
