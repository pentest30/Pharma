import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GridComponent, GridModel } from '@syncfusion/ej2-angular-grids';
import { DataManager, Query, ReturnOption, UrlAdaptor } from '@syncfusion/ej2-data';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { DateHelper } from 'src/app/shared/date-helper';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { environment } from 'src/environments/environment';
import { DetailInvoiceComponent } from '../detail-invoice/detail-invoice.component';
import { Invoice } from '../models/Invoice';
import { InvoiceItem } from '../models/InvoiceItem';
import { saveAs } from  'file-saver';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-invoice-log-list',
  templateUrl: './invoice-log-list.component.html',
  styleUrls: ['./invoice-log-list.component.sass']
})
export class InvoiceLogListComponent extends BaseComponent  implements OnInit {
  total: number;
  totalHtt: number;
  loading: boolean = false;
  public start: Date= new Date(new Date().getFullYear(), 0, 1);
  public end : Date;
  totalAmount : any ;
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('detailgrid') public detailgrid: GridComponent;
  isOpen: any;
  private eventsSubscription: Subscription;
  @Input() customerId: string;
  @Input() envetsInvoice: Observable<void>;

  constructor(private authService : AuthService,
    private invoiceService : InvoiceService,
    private notif: NotificationHelper,
    private dialog: MatDialog,
    private http : HttpClient ,
    private signalRService : SignalRService, 
    private dateHelper: DateHelper) { 
    super(authService,'invoices/');
  }
  
  ngOnInit(): void {
    //this.loadData();
    this.selectionOptions = { checkboxMode: 'ResetOnRowClick'};
    this.eventsSubscription = this.envetsInvoice.subscribe(() => this.loadInvoices());
  }
  public dataBound(e) {
    console.log(this.data.dataSource);
    this.total = 0;
    this.totalHtt = 0;

    var details :  InvoiceItem[] = [];
    for (let index = 0; index < this.grid.getCurrentViewRecords().length; index++) {
      const element = this.grid.getCurrentViewRecords()[index] as Invoice;

      for (let index = 0; index < element.invoiceItems.length; index++) {
        const item = element.invoiceItems[index];
        details.push(item);

      }
    }
   
  }

  async print(row) {
    await this.invoiceService.print(row.id).toPromise();
    this.notif.showNotification('mat-primary',"Facture Imprimé avec succès",'top','right');
  }
  async printSelectedInvoices() {
    this.loading = true;
    const selectedrecords: any[] = this.grid.getSelectedRecords();  // Get the selected records.
    let Bls = [];
    for (let index = 0; index < selectedrecords.length; index++) {
      const element = selectedrecords[index];
      Bls.push(element.id);
    }
    await this.invoiceService.PrintBulkBl({ids : Bls}).toPromise();
    this.notif.showNotification('mat-primary',"Factures Selectionnées ont été Imprimées avec succès",'top','right');
    this.loading = false;
    this.loadData();
  }
  async loadInvoices() {
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + this.baseUrl + this.customerId + "/sales-log",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.token,"start" : this.dateHelper.toShorDate(this.start), "end" : this.dateHelper.toShorDate(this.end) }],
      
    });
    this.invoiceService.getTurnoverOfCustomer(this.customerId,this.dateHelper.toShorDate(this.start),this.dateHelper.toShorDate(this.end)).subscribe(rep=> {
    this.totalAmount = rep;
     
   });
   
  }

  async view(salesInvoice) {
    //var Bl = await this.s.getById(order.id).toPromise();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      invoice: salesInvoice,
    };
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';
    if(!this.isOpen)  {
      var modalRef = this.dialog.open(DetailInvoiceComponent, dialogConfig);
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

  exportExcel() {
    var url  =environment.ResourceServer.Endpoint + "invoices/" + this.customerId+ "/export-excel";
   
    let header = new HttpHeaders();
    header
    .set('Authorization', 'Bearer ' +this.authService.getToken);
    let params = new HttpParams()
    .set("start" , this.dateHelper.toShorDate(this.start))
    .set("end" , this.dateHelper.toShorDate(this.end));
     this.http.get(url,   {headers: header,params, responseType: 'blob'}).subscribe(
      (data) => this.saveFile(data)), // console.log(data),
      (error) => console.log("Error downloading the file."),
      () => console.info("OK");

  }
  saveFile(data: any) {
    const contentType = 'application/vnd.openxmlformats-ficedocument.spreadsheetml.sheet'; 
    const blob = new Blob([data], { type: contentType });
    //const url = window.URL.createObjectURL(blob);
    saveAs(blob, "journal-ventes" + '.xlsx');
   // window.open(url);
    
  }

}
