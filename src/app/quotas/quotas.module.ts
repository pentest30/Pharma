import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotaListComponent } from './quota-list/quota-list.component';
import { PipesModule } from '../pipes/pipes.module';
import { MaterialModule } from '../shared/material-module';
import { QuotaRoutingModule } from './quota.routing.module';
import { QuotaAddComponent } from './quota-add/quota-add.component';
import { QuotaTransferComponent } from './quota-transfer/quota-transfer.component';
import { QuotaRequestListComponent } from './quota-request-list/quota-request-list.component';
import { QuotaReceivedListComponent } from './quota-received-list/quota-received-list.component';
import { QuotaValidationComponent } from './quota-validation/quota-validation.component';
import { QuotaRequestValidationComponent } from './quota-request-validation/quota-request-validation.component';
import { AvailableQntListComponent } from './available-qnt-list/available-qnt-list.component';
import { ReportViewerModule } from 'ngx-ssrs-reportviewer';
import { QuotaSsrsComponent } from './quota-ssrs/quota-ssrs.component';
import { SupervisorTransfertComponent } from './supervisor-transfert/supervisor-transfert.component';
import { TransferQuotaToSalesPersonComponent } from './transfer-quota-to-sales-person/transfer-quota-to-sales-person.component';
import { SupervisorTransferListComponent } from './supervisor-transfer-list/supervisor-transfer-list.component';
import { SupervisorTransferAnnulationComponent } from './supervisor-transfer-annulation/supervisor-transfer-annulation.component';
import { QuotaResuqetByProductsComponent } from './quota-transfer/quota-resuqet-by-products/quota-resuqet-by-products.component';



@NgModule({
  providers: [],
  declarations: [
    QuotaListComponent,
    QuotaAddComponent,
    QuotaTransferComponent,
    QuotaRequestListComponent,
    QuotaReceivedListComponent,
    QuotaValidationComponent,
    QuotaRequestValidationComponent, 
    AvailableQntListComponent
    , QuotaSsrsComponent,
     SupervisorTransfertComponent,
      TransferQuotaToSalesPersonComponent,
      SupervisorTransferListComponent,
      SupervisorTransferAnnulationComponent,
      QuotaResuqetByProductsComponent
  ],
  imports: [
    CommonModule,
    QuotaRoutingModule,
    PipesModule,
    MaterialModule,
    ReportViewerModule
  ]
})
export class QuotasModule { }
