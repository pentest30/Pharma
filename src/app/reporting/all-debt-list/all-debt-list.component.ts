import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { InvoiceDebtDetailsComponent } from 'src/app/billing/invoice-debt-details/invoice-debt-details.component';
import { AuthService } from 'src/app/services/auth.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { DateHelper } from 'src/app/shared/date-helper';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-all-debt-list',
  templateUrl: './all-debt-list.component.html',
  styleUrls: ['./all-debt-list.component.sass']
})
export class AllDebtListComponent extends BaseComponent  implements OnInit {
  totalInvoice: number = 0;
  totalPayed : number = 0;
  totalDebt: number = 0;
  loading: boolean = false;
  public start :Date ;
  public end : Date;
  totalAmount : any ;
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('detailgrid') public detailgrid: GridComponent;
  isOpen: any;
  isLoading : boolean;
  debtDetails: any;
  customerId: string;
  constructor(private authService : AuthService,
    private invoiceService : InvoiceService,
    private notif: NotificationHelper,
    private dialog: MatDialog,
    private http : HttpClient ,
    private signalRService : SignalRService, 
    private dateHelper: DateHelper) { 
    super(authService,'invoices/') 
  }

  ngOnInit(): void {
    this.loadDebts();
  }
  dataBound($event) {

  }
  begin($event) {

  } 
  async view(salesInvoice) {
    //var Bl = await this.s.getById(order.id).toPromise();
    console.log(salesInvoice);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
     customerCode :   salesInvoice.customerCode,
     item : salesInvoice,
     customerId : null
    };
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';
    if(!this.isOpen)  {
      var modalRef = this.dialog.open(InvoiceDebtDetailsComponent, dialogConfig);
      this.isOpen = true;
      modalRef.afterClosed().subscribe(res => {
        this.isOpen = false;

      });
    }
  }
  loadDebtDetails () {
    this.debtDetails = new DataManager({
      url: environment.ResourceServer.Endpoint + "invoices/" + this.customerId + "/customer-debt-details",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.authService.getToken }],      
    });
  }
  loadDebts () {
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "invoices/all/customer-debt",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.authService.getToken }],      
    });
  }
}
