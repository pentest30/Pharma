import { QuotaAddComponent } from './../quota-add/quota-add.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { AuthService } from 'src/app/services/auth.service';
import { PermissionService } from 'src/app/services/permission.service';
import { QuotaService } from 'src/app/services/quota.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { environment } from 'src/environments/environment';
import { QuotaRequestValidationComponent } from '../quota-request-validation/quota-request-validation.component';
import { QuotaValidationComponent } from '../quota-validation/quota-validation.component';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
@Component({
  selector: 'app-quota-received-list',
  templateUrl: './quota-received-list.component.html',
  styleUrls: ['./quota-received-list.component.sass']
})
export class QuotaReceivedListComponent extends BaseComponent implements OnInit {
  data: DataManager;
  public status: string[]  = ["Demande en attente", "Demande validée", "Demande rejetée"];
  isSales : boolean = false;
  isSuprvisor : boolean = false;
  isSalesPerson : boolean = false;
  @ViewChild('grid') public grid: GridComponent;
  constructor(private dialog: MatDialog,
    private authService : AuthService,
     private quotaService : QuotaService,
     private notif: NotificationHelper,
      private permService: PermissionService) {
    super(authService, 'quotas/received/');
  }

  ngOnInit(): void {
    this.isSales = this.permService.isBuyer() ||this.permService.isBuyerGroup();
    this.isSuprvisor = this.permService.isSupervisor();
    this.isSalesPerson = this.permService.isSalesPerson();
    this.loadData();
  }
  validate(row) {
    this.quotaService.validate(row.id).subscribe(result => {
      //console.log(this.quotaId.availableQuantity);
      this.notif.showNotification('mat-success','Validation terminée avec succès','top','right');
      this.loadData();
    }, (error) => {
      this.notif.showNotification('mat-warn',error,'top','right');


    });
  }
  edit(row) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {qnt : row.quantity, productId: row.productId, productCode : row.productCode, productName: row.productName, requestId: row.id,
       customerName: row.customerName, customerCode: row.customerCode};
   // dialogConfig.width ="400px";
     var modalRef = this.dialog.open(QuotaValidationComponent, dialogConfig);
  modalRef.afterClosed().subscribe(x=> {
    this.loadData();

  });
}
  buyerValidation(row) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {requestId : row.id, customerCode : row.customerCode, productCode : row.productCode, quantity : row.quantity}
   // dialogConfig.width ="400px";
    var modalRef = this.dialog.open(QuotaAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(x=> {
      this.loadData();
    });

  }
  reject(row) {
    this.quotaService.rejectQuotaRequest(row.id).subscribe(result => {
      //console.log(this.quotaId.availableQuantity);
      this.notif.showNotification('mat-success','Annulation terminée avec succès','top','right');
      this.loadData();
    }, (error) => {
      this.notif.showNotification('mat-warn',error,'top','right');


    });
  }
  public onChange(args: any): void {
    let filter;
    filter = this.enumLookupData['requestStatus'][args.value];
    if(filter != null)
    this.grid.filterByColumn(args.element.id, 'equal', filter);
    else this.grid.removeFilteredColsByField(args.element.id, true);
  }
}
