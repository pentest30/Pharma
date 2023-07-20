import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { QuotaAddComponent } from '../quota-add/quota-add.component';
import { environment } from 'src/environments/environment';
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { AuthService } from 'src/app/services/auth.service';
import { QuotaService } from 'src/app/services/quota.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { PermissionService } from 'src/app/services/permission.service';
import { GridComponent, GroupSettingsModel } from '@syncfusion/ej2-angular-grids';
import { QuotaTransferComponent } from '../quota-transfer/quota-transfer.component';
import { DialogHelper } from 'src/app/shared/DialogHelper';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { DateHelper } from 'src/app/shared/date-helper';
import { saveAs } from  'file-saver';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SupervisorTransfertComponent } from '../supervisor-transfert/supervisor-transfert.component';

import { TransferQuotaToSalesPersonComponent } from '../transfer-quota-to-sales-person/transfer-quota-to-sales-person.component';

@Component({
  selector: 'app-quota-list',
  templateUrl: './quota-list.component.html',
  styleUrls: ['./quota-list.component.sass']
})
export class QuotaListComponent extends BaseComponent implements OnInit {
  data: DataManager;
  isSales : boolean = false;
  isSuprvisor : boolean = false;
  SupervisorAndSales : boolean = false;
  details : any[] = [];
  detailsInit : DataManager;
  public rclUrl : string;
  @ViewChild("grid2")
  public grid: GridComponent;
  public groupOptions: GroupSettingsModel;
  groupOptions2: { showDropArea: boolean; columns: string[]; };
  constructor(private dialog: MatDialog,
    private authService : AuthService,
    private dialogHelper: DialogHelper,
     private quotaService : QuotaService,
     private notif: NotificationHelper,
      private permService: PermissionService, 
       private dateHelper: DateHelper ,private http : HttpClient ) {
    super(authService, 'quotas/');
  }
  
  ngOnInit(): void {
    this.isSales = this.permService.isBuyer() ||this.permService.isBuyerGroup() ;
    this.isSuprvisor = this.permService.isSupervisor();
    this.SupervisorAndSales = this.permService.isSupervisor() || this.permService.isBuyer() ||this.permService.isBuyerGroup() ;
    this.groupOptions = { showDropArea: true };
    this.groupOptions2 = { showDropArea: true, columns: ['customerName'] };
    this.loadData();
    this.rclUrl = environment.ResourceServer.Endpoint + "customers";
  }
  async edit(row ) {
    var response = await this.dialogHelper.confirmDialog(this.dialog, "Est-vous sûr de vouloir libérer cette quantité");
    if(response) {
      this.quotaService.put( {id : row.productId, date : row.quotaDate,salesPersonId : row.salesPersonId}).subscribe(result => {

        this.notif.showNotification('mat-success','Mise à jours terminée avec succéss','top','right');
        this.loadData();
      }, (error) => {
        this.notif.showNotification('mat-warn',error,'top','right');
      });
    }
  }
  transfer() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
   // dialogConfig.width ="400px";
    var modalRef = this.dialog.open(QuotaTransferComponent, dialogConfig);
    modalRef.afterClosed().subscribe(x=> {
      this.loadData();
    });
  }
  add() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {requestId : null};
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';

   // dialogConfig.width ="400px";
    var modalRef = this.dialog.open(QuotaAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(x=> {
      this.loadData();
    });
  }
  rowSelected($event) {
    this.details = $event.data.quotaTransactions;
    this.detailsInit = new DataManager({
      url: environment.ResourceServer.Endpoint + "quotas-init/search",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.authService.getToken , "start" : this.dateHelper.toShorDate($event.data.quotaDate), "salesPersonId" : $event.data.salesPersonId, "pId" :$event.data.productId }],
    });
  }
  downloadFile () {
    var url  =environment.ResourceServer.Endpoint + "quotas/customers";
    let header = new HttpHeaders();
    
    header.append('Authorization', 'Bearer ' +this.authService.getToken);
     this.http.get(url,   {headers : header, responseType: 'blob'}).subscribe(
      (data) => this.saveFile(data)), // console.log(data),
      (error) => console.log("Error downloading the file."),
      () => console.info("OK");;

  }
  quotaTransfer() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {requestId : null};
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';
   // dialogConfig.width ="700px";
    //dialogConfig.height ="600px";
    var modalRef = this.dialog.open(SupervisorTransfertComponent, dialogConfig);
    modalRef.afterClosed().subscribe(x=> {
      this.loadData();
    });
  }
  saveFile(data: any) {
    const contentType = 'application/vnd.openxmlformats-ficedocument.spreadsheetml.sheet'; 
    const blob = new Blob([data], { type: contentType });
    //const url = window.URL.createObjectURL(blob);
    saveAs(blob, "quota" + '.xlsx');
   // window.open(url);
    
  }
  async transferToSalesPerson(row){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = row
    console.log(row)
   // dialogConfig.width ="400px";
    var modalRef = this.dialog.open(TransferQuotaToSalesPersonComponent, dialogConfig);
    modalRef.afterClosed().subscribe(x=> {
      this.loadData();
    });
    this.loadData();
  }
  
}
