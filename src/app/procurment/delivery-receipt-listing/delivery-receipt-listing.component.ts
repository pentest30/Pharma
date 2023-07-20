import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DeliveryReceiptService } from 'src/app/services/delivery-receipt.service';
import { PermissionService } from 'src/app/services/permission.service';
import { SupplierInvoiceService } from 'src/app/services/supplier-invoice.service';
import { SupplierOrderService } from 'src/app/services/supplier-order.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { DataManager } from "@syncfusion/ej2-data";
import { DeliveryReceiptItem } from '../models/DeliveryReceiptItem';
import { DeliveryReceipt } from '../models/DeliveryReceipt';
import { GridComponent, GridModel } from '@syncfusion/ej2-angular-grids';
import { ValidSupplierInvoicesComponent } from '../valid-supplier-invoices/valid-supplier-invoices.component';
import { SupplierInvoice } from '../models/SupplierInvoice';
import { SignalRService } from 'src/app/services/signal-r.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { DetailDeliveryReceiptComponent } from '../detail-delivery-receipt/detail-delivery-receipt.component';

@Component({
  selector: 'app-delivery-receipt-listing',
  templateUrl: './delivery-receipt-listing.component.html',
  styleUrls: ['./delivery-receipt-listing.component.sass']
})
export class DeliveryReceiptListingComponent extends BaseComponent implements OnInit {
  gridLines: string;
  isBuyer: boolean;
  isBuyerGroup: boolean;
  editSettings: { allowEditing: boolean; allowDeleting: boolean; };
  isOpen: any;
  data: DataManager;
  totalHtt: number;
  total: number;
  navigation: any;
  validating:any[] = [''];

  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('detailgrid') public detailgrid: GridComponent;
  public childGrid: GridModel = {
    dataSource: [],
    queryString: 'deliveryReceiptId',
    columns: [
        { field: 'deliveryReceiptId', headerText: 'N°', textAlign: 'Right', width: 80 , visible : false},
        { field: 'productCode', headerText: 'Code produit', width: 90 },
        { field: 'productName', headerText: 'Nom', width: 250 },
        { field: 'vendorBatchNumber', headerText: 'Lot Fr', width: 150  },
        { field: 'internalBatchNumber', headerText: 'Lot Int', width: 150 },
        { field: 'unitPrice', headerText: 'P.U', width: 150 , type:"number", format:"N2"},
        { field: 'discount', headerText: 'Remise', width: 150, type:"number", format:"N2"  },
        { field: 'salePrice', headerText: 'P.Vente', width: 150 , type:"number", format:"N2"},
        { field: 'quantity', headerText: 'Qnt', width: 150 },
        { field: 'pfs', headerText: 'SHP', width: 150 , type:"number", format:"N2"},
        { field: 'ppa', headerText: 'PPA HT', width: 150 , type:"number", format:"N2"},
        { field: 'expiryDate', headerText: 'DDP', width: 150 ,format:'dd/MM/yyyy', type:'date'},
    ],
  };
  public dropStates: string[] = ["Créé","Enregistré","En cours de traitement","Cloturé","Validé"];
  public fields: object = { text: 'status', value: 'status' };
  supplierInvoice: SupplierInvoice;
  filters: any;
  constructor(
    private authService : AuthService,
    private supplierInvoiceService : SupplierInvoiceService,
    private deliveryReceiptService : DeliveryReceiptService,
    private notif: NotificationHelper,
    private dialog: MatDialog,
    private permService: PermissionService,
    private route: Router, 
    private signalRService : SignalRService
  ) {
    super(authService,'delivery-receipts/');
    this.navigation = route.getCurrentNavigation();
  }
  @HostListener('resize', ['$event'])
  onResize(event) {
    var offsetHeight = event.target.innerHeight - 415 ;
    setTimeout(()=> {
      this.grid.height = offsetHeight + "px";
    }, 0);
  
  }
  @HostListener('document:keydown', ['$event'])

  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case "F4":
        event.preventDefault();
        console.log(this.isOpen);

        if(!this.isOpen && this.permService.isBuyer()  ||this.permService.isBuyerGroup()) this.add();
        else { 
          this.notif.showNotification('mat-warn',"vous n'êtes pas autorisé de créer une commande", null, null);
          return
        }
        break;
      default:
        break;
    }
  }

  ngOnInit(): void {
    this.selectionOptions = { checkboxMode: 'ResetOnRowClick'};
    this.loadData();

    this.isBuyer = this.permService.isBuyer();
    this.isBuyerGroup = this.permService.isBuyerGroup();
    this.signalRService.getProcurementMessage().subscribe(msg => {
      this.notif.showNotification('mat-success',msg,'top','right');
      this.loadData();

    });
   
  }
 
  add() {
    if(!this.isOpen) {
      this.isOpen = true;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      var ref=  this.dialog.open(ValidSupplierInvoicesComponent);
      const sub = ref.componentInstance.onAdd.subscribe( supplierInvoice => {
      });
      ref.afterClosed().subscribe(supplierInvoice => {
        if(!supplierInvoice)
        {
          this.isOpen = false;
          return;
        }
        this.route.navigate(['/procurment/add-delivery-receipt/'], { state: {supplierInvoice:JSON.stringify(supplierInvoice), deliveryReceipt: null } });
        this.isOpen = false;
      });
    }
  }
 
  async edit(row) {
    console.log(row);
    let supplierInvoice = <SupplierInvoice>await this.supplierInvoiceService.getInvoiceById(row.invoiceId).toPromise();
    let deliveryReceipt = JSON.stringify(row);
    this.route.navigate(['/procurment/add-delivery-receipt/'], { state: {supplierInvoice: JSON.stringify(supplierInvoice), deliveryReceipt: deliveryReceipt } });

  }
  public dataBound(e) {
    this.total = 0;
    this.totalHtt = 0;

    var details :  DeliveryReceiptItem[] = [];
    for (let index = 0; index < this.grid.getCurrentViewRecords().length; index++) {
      const element = this.grid.getCurrentViewRecords()[index] as DeliveryReceipt;

      for (let index = 0; index < element.items.length; index++) {
        const item = element.items[index];
        details.push(item);
        
      }
    }
    this.childGrid.dataSource = details;
    this.grid.selectRow(0);
    // this.grid.autoFitColumns();
  }
  async save(row) {
    await this.deliveryReceiptService.save(row.id).toPromise();
    this.notif.showNotification('mat-success','Le bon de reception est enregistré','top','right');
    this.loadData();
  }
  async validate(row) {
    let isValid = false;
    let supplierInvoice = <SupplierInvoice>await this.supplierInvoiceService.getInvoiceById(row.invoiceId).toPromise();
    for(let element of row.items) {
      let remainingQuantity = supplierInvoice.items.find(item => element.productId == item.productId && element.internalBatchNumber == item.internalBatchNumber).remainingQuantity;
      if(element.quantity <= remainingQuantity)
      isValid = true;
      if(element.quantity > remainingQuantity){
         isValid = false;
         break;
      }  
    }
    if(isValid){
      if(!this.validating.includes(row.id)){
        this.validating.push(row.id);
        await this.deliveryReceiptService.validate(row.id).toPromise();
        this.notif.showNotification('mat-success','Le bon de reception est en cours de validation','top','right');
      }
    }else{
      this.notif.showNotification('mat-warning','Le bon de reception ne peut pas être validé','top','right');
    }
  
    this.loadData();
  }
  async delete(row) {
    await this.deliveryReceiptService.delete(row.id).toPromise();
    this.notif.showNotification('mat-success','Le bon de reception est supprimé','top','right');
    this.loadData();
  }
  async view(deliveryReceipt) {
    //var Bl = await this.deliveryReceiptService.getById(order.id).toPromise();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { 
      deliveryReceipt: deliveryReceipt, 
    };
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';
    if(!this.isOpen)  {
      var modalRef = this.dialog.open(DetailDeliveryReceiptComponent, dialogConfig);
      this.isOpen = true;
      modalRef.afterClosed().subscribe(res => {
        this.isOpen = false;

      });
    }
  }

}
