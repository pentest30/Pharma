import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { AuthService } from 'src/app/services/auth.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { DateHelper } from 'src/app/shared/date-helper';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { InvoiceDebtDetailsComponent } from '../invoice-debt-details/invoice-debt-details.component';

@Component({
  selector: 'app-debt-log-list',
  templateUrl: './debt-log-list.component.html',
  styleUrls: ['./debt-log-list.component.sass']
})
export class DebtLogListComponent extends BaseComponent  implements OnInit {
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
  @Input() customerId: string;
  
  @Input() set eventsDebt(value: any) {
    this.isLoading = true;
    this.loadInvoices().then(rep=> { this.isLoading = false;});
}

  listOfDebts : any = [];
  toolbar  : any;
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
    this.selectionOptions = { checkboxMode: 'ResetOnRowClick'};
    this.toolbar =  ['ExcelExport'];
  }
 
  async loadInvoices() {
    this.listOfDebts = await this.invoiceService.getDetsOfCustomer(this.customerId).toPromise();
    
  }
  public dataBound(e) {
    this.totalInvoice = 0;
    this.totalPayed = 0;
    this.totalDebt=0;
    for (let index = 0; index < this.grid.getCurrentViewRecords().length; index++) {
      const element = this.grid.getCurrentViewRecords()[index] as any;
      this.totalInvoice +=  parseFloat(element.invoiceAmount);
      this.totalPayed += parseFloat(element.paymentAmount);
      this.totalDebt += parseFloat(element.dept);
    }
  }
  exportExcel() {}
  async view(salesInvoice) {
    //var Bl = await this.s.getById(order.id).toPromise();
    console.log(salesInvoice);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
     customerId :   this.customerId,
     item : salesInvoice,
      customerCode : null
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
  onStrtChange($event) {
    this.loadInvoices();

  }
  onEndChange($event) {
    this.loadInvoices();
  }
  toggleSearch($event) {}


}
