import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { AuthService } from 'src/app/services/auth.service';
import { PermissionService } from 'src/app/services/permission.service';
import { QuotaService } from 'src/app/services/quota.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { QuotaTransferComponent } from '../quota-transfer/quota-transfer.component';
import { environment } from 'src/environments/environment';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { QuotaResuqetByProductsComponent } from '../quota-transfer/quota-resuqet-by-products/quota-resuqet-by-products.component';
@Component({
  selector: 'app-quota-request-list',
  templateUrl: './quota-request-list.component.html',
  styleUrls: ['./quota-request-list.component.sass']
})
export class QuotaRequestListComponent extends BaseComponent implements OnInit {

  constructor(private dialog: MatDialog, 
    private authService : AuthService,
     private quotaService : QuotaService,
     private notif: NotificationHelper, 
     private permService: PermissionService) {
    super(authService, "quotas/request/");
  }
  displayedColumns: string[] = [ 'productCode', 'productName','dateShort','quantity','customerName','customerCode','salesPersonName','status',];
  public status: string[]  = ["Demande en attente", "Demande validée", "Demande rejetée"];
  data: DataManager;
  isSales : boolean = false;
  isSuprvisor : boolean = false;
  public fields: object = { text: 'status', value: 'status' };
  @ViewChild('grid') public grid: GridComponent;
  ngOnInit(): void {
    this.loadData();
  }
  transfer() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';

   // dialogConfig.width ="400px";
    var modalRef = this.dialog.open(QuotaTransferComponent, dialogConfig);
    modalRef.afterClosed().subscribe(x=> {
      this.loadData();
    });
    //this.loadData();
  }
  public onChange(args: any): void {
    let filter;
    filter = this.enumLookupData['requestStatus'][args.value];
    if(filter != null)
    this.grid.filterByColumn(args.element.id, 'equal', filter);
    else this.grid.removeFilteredColsByField(args.element.id, true);
  }

  groupedTransfer() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';

   // dialogConfig.width ="400px";
    var modalRef = this.dialog.open(QuotaResuqetByProductsComponent, dialogConfig);
    modalRef.afterClosed().subscribe(x=> {
      this.loadData();
    });
  }
 
  // loadData() {
  //   this.data = new DataManager({
  //     url: environment.ResourceServer.Endpoint + "quotas/request/search",
  //     adaptor: new UrlAdaptor(),
  //     headers: [{ Authorization: "Bearer " + this.authService.getToken }],
  //   });
  // }
}
