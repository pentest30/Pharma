import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreparationOrdersRoutingModule } from './preparation-orders-routing.module';
import { ListingPreparationOrdersComponent } from './listing-preparation-orders/listing-preparation-orders.component';
import { MaterialModule } from '../shared/material-module';
import { OrdersForAgentComponent } from './orders-for-agent/orders-for-agent.component';
import { PreparationOrderDetailComponent } from './preparation-order-detail/preparation-order-detail.component';
import { PreparationOrderEditionComponent } from './preparation-order-edition/preparation-order-edition.component';
import { AddBlProductComponent } from './add-bl-product/add-bl-product.component';
import { PipesModule } from '../pipes/pipes.module';
import { ArchiveOpComponent } from './archive-op/archive-op.component';
import { ControlledOpComponent } from './controlled-op/controlled-op.component';
import { OpConsolidationComponent } from './op-consolidation/op-consolidation.component';
import { ConsolidationListingComponent } from './consolidation-listing/consolidation-listing.component';
import { AddOpAgentsComponent } from './add-op-agents/add-op-agents.component';
import { ExpeditionComponent } from './expedition/expedition.component';
import { ExpeditionListingComponent } from './expedition-listing/expedition-listing.component';
import { DeleiveryOrderListingComponent } from './deleivery-order-listing/deleivery-order-listing.component';
import { EditPreparationItemFormComponent } from './edit-preparation-item-form/edit-preparation-item-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OpFormControlComponent } from './op-form-control/op-form-control.component';
import { BarcodeScannerLivestreamModule } from "ngx-barcode-scanner";
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ScanFormComponent } from './scan-form/scan-form.component';
import { PromptPackingComponent } from './prompt-packing/prompt-packing.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { DeviceDetectorService } from 'ngx-device-detector';


@NgModule({
  declarations: [
    ListingPreparationOrdersComponent,
    OrdersForAgentComponent,
    PreparationOrderDetailComponent, 
    PreparationOrderEditionComponent, 
    AddBlProductComponent, 
    ArchiveOpComponent, 
    ControlledOpComponent, 
    OpConsolidationComponent, 
    ConsolidationListingComponent, 
    AddOpAgentsComponent, 
    ExpeditionComponent, 
    ExpeditionListingComponent, 
    DeleiveryOrderListingComponent,
    EditPreparationItemFormComponent,
    OpFormControlComponent,
    OpConsolidationComponent,
    ConsolidationListingComponent,
    AddOpAgentsComponent,
    ExpeditionComponent,
    ExpeditionListingComponent,
    DeleiveryOrderListingComponent,
    ScanFormComponent,
    PromptPackingComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PreparationOrdersRoutingModule,
    PipesModule,
    MaterialModule,
    BarcodeScannerLivestreamModule,
    ZXingScannerModule,
    DeviceDetectorModule
  ],
  providers: [DeviceDetectorService]

})
export class PreparationOrdersModule { }
