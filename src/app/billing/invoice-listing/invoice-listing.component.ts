import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GridComponent, GridModel } from '@syncfusion/ej2-angular-grids';
import { AuthService } from 'src/app/services/auth.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { DetailInvoiceComponent } from '../detail-invoice/detail-invoice.component';
import { Invoice } from '../models/Invoice';
import { InvoiceItem } from '../models/InvoiceItem';

@Component({
  selector: 'app-invoice-listing',
  templateUrl: './invoice-listing.component.html',
  styleUrls: ['./invoice-listing.component.sass']
})
export class InvoiceListingComponent extends BaseComponent  implements OnInit {
  total: number;
  totalHtt: number;
  loading: boolean = false;
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('detailgrid') public detailgrid: GridComponent;
  isOpen: any;
  constructor(
    private authService : AuthService,
    private invoiceService : InvoiceService,
    private notif: NotificationHelper,
    private dialog: MatDialog,
    private signalRService : SignalRService
  ) {
    super(authService,'invoices/');
  }
  public childGrid: GridModel = {
    dataSource: [],
    queryString: 'invoiceId',
    columns: [
        { field: 'invoiceId', headerText: 'N°', textAlign: 'Right', width: 80 , visible : false},
        { field: 'productCode', headerText: 'Code produit', width: 90 },
        { field: 'productName', headerText: 'Nom', width: 250 },
        { field: 'vendorBatchNumber', headerText: 'Lot Fr', width: 150  },
        { field: 'internalBatchNumber', headerText: 'Lot Int', width: 150 },
        { field: 'unitPrice', headerText: 'P.U', width: 150 , type:"number", format:"N2"},
        { field: 'discountRate', headerText: 'Remise', width: 150, type:"number", format:"N2"  },
        { field: 'quantity', headerText: 'Qnt', width: 150 },
        { field: 'pfs', headerText: 'SHP', width: 150 , type:"number", format:"N2"},
        { field: 'ppaHT', headerText: 'PPA HT', width: 150 , type:"number", format:"N2"},
        { field: 'expiryDate', headerText: 'DDP', width: 150 ,format:'dd/MM/yyyy', type:'date'},
    ],
  };
  ngOnInit(): void {
    this.loadData();
    this.selectionOptions = { checkboxMode: 'ResetOnRowClick'};

  }
  public dataBound(e) {
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
    this.childGrid.dataSource = details;
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
    this.notif.showNotification('mat-primary',"Factures Selectionnés Imprimés avec succès",'top','right');
    this.loading = false;
    this.loadData();
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
}
