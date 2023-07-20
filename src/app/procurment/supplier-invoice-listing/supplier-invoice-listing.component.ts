import { CalculMethodHelper } from './../../shared/CalculMethodHelper';
import { Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommandModel, EditSettingsModel, GridComponent, GridModel, SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DataManager  } from "@syncfusion/ej2-data";
import { AuthService } from 'src/app/services/auth.service';
import { PermissionService } from 'src/app/services/permission.service';
import { SupplierInvoiceService } from 'src/app/services/supplier-invoice.service';
import { SupplierOrderService } from 'src/app/services/supplier-order.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { SupplierInvoice } from '../models/SupplierInvoice';
import { SupplierInvoiceItem } from '../models/SupplierInvoiceItem';
import { ValidSupplierOrdersComponent } from '../valid-supplier-orders/valid-supplier-orders.component';
import { DialogHelper } from 'src/app/shared/DialogHelper';
import { DetailSupplierInvoiceComponent } from '../detail-supplier-invoice/detail-supplier-invoice.component';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-supplier-invoice-listing',
  templateUrl: './supplier-invoice-listing.component.html',
  styleUrls: ['./supplier-invoice-listing.component.sass']
})
export class SupplierInvoiceListingComponent extends BaseComponent implements OnInit {
  gridLines: string;
  data: DataManager;
  filters: object = {};
  selectionOptions: SelectionSettingsModel;
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('grid2') public grid2: GridComponent;
  @ViewChild('detailgrid') public detailgrid: GridComponent;
  isOpen: any;
  barcodeFormControl = new FormControl();
  barCode: string ="";
  EditByScan: boolean = false;
  isValid : boolean = false;
  cachedProduct: any[] = [];
  @Output() onAdd = new EventEmitter();
  supplierId: any;
  pendingSupplierOrders: any = [];
  total: number;
  totalHtt: number;
  public editSettings: EditSettingsModel;
  public commandListing: CommandModel[];
  public commandPending: CommandModel[];
  isBuyer : boolean = false;
  isBuyerGroup : boolean = false;
  public childGrid: GridModel = {
    dataSource: [],
    queryString: 'invoiceId',
    columns: [
        { field: 'invoiceId', headerText: 'N°', textAlign: 'Right', width: 80 , visible : false},
        { field: 'productCode', headerText: 'Code produit', width: 90 },
        { field: 'productName', headerText: 'Nom', width: 250 },
        { field: 'orderId', headerText: 'Cmd', width: 150  },
        { field: 'vendorBatchNumber', headerText: 'Lot Fr', width: 150  },
        { field: 'internalBatchNumber', headerText: 'Lot Int', width: 150 },
        { field: 'purchaseUnitPrice', headerText: 'P.U', width: 150 , type:"number", format:"N2"},
        { field: 'discount', headerText: 'Remise', width: 150, type:"number", format:"N2"  },
        { field: 'salePrice', headerText: 'P.Vente', width: 150 , type:"number", format:"N2"},
        { field: 'quantity', headerText: 'Qnt', width: 150 },
        { field: 'remainingQuantity', headerText: 'Qnt Res', width: 150 },
        { field: 'pfs', headerText: 'SHP', width: 150 , type:"number", format:"N2"},
        { field: 'ppaHT', headerText: 'PPA HT', width: 150 , type:"number", format:"N2"},
        { field: 'expiryDate', headerText: 'DDP', width: 150 ,format:'dd/MM/yyyy', type:'date'},

    ],
  };
  public dropStates: string[] = ["Créé","Enregistré","En cours de traitement","Cloturé","Validé"];
  public fields: object = { text: 'invoiceStatus', value: 'invoiceStatus' };
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
      case "Enter":
        event.preventDefault();
        return;
      default:
        break;
    }
  }
  constructor(
    private authService : AuthService,
    private supplierInvoiceService : SupplierInvoiceService,
    private supplierService : SupplierService,
    private supplierOrderService : SupplierOrderService,
    private notif: NotificationHelper,
    private dialog: MatDialog,
    private dialogHelper: DialogHelper,
    private permService: PermissionService,
    private route: Router,
    private calculHelper: CalculMethodHelper,
    private productService:ProductService,
  ) {
    super(authService,"supplier-invoices/");

  }

  async ngOnInit() {
    this.loadData();
    this.selectionOptions = { checkboxMode: 'ResetOnRowClick'};
    this.isBuyer = this.permService.isBuyer();
    this.isBuyerGroup = this.permService.isBuyerGroup();
    if(this.permService.isBuyer() ||this.permService.isBuyerGroup()){
    }
  }
  add() {
    if(!this.isOpen) {
      this.isOpen = true;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = "100vh";
      dialogConfig.height = "100%";
      dialogConfig.width = "100%";
      dialogConfig.panelClass= 'full-screen-modal';

      var ref=  this.dialog.open(ValidSupplierOrdersComponent, dialogConfig);
      const sub = ref.componentInstance.onAdd.subscribe(res => {
        this.isOpen = false;
        if(res) this.supplierId = res;
      });
      ref.afterClosed().subscribe(res => {
        if(!res)
        {
          this.isOpen = false;
          return;
        }
        this.route.navigate(['/procurment/add-supplier-invoice/'], { state: {supplierInvoice:null, supplierOrder: JSON.stringify(res.supplierOrder),supplier: res.supplier } });
        this.isOpen = false;
      });
    }
  }
  view(raw) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      supplierInvoice: raw,
    };
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';

    if(!this.isOpen)  {
      var modalRef = this.dialog.open(DetailSupplierInvoiceComponent, dialogConfig);
      this.isOpen = true;
      modalRef.afterClosed().subscribe(res => {
        this.isOpen = false;

      });
    }
  }
  async edit(row) {
    let supplierInvoice = await this.supplierInvoiceService.getInvoiceById(row.id).toPromise();
    let supplierOrder = await this.supplierOrderService.getById(row.orderId).toPromise();
    let supplier = await this.supplierService.getSupplierByOrgId(row.supplierId).toPromise();
    this.route.navigate(['/procurment/add-supplier-invoice/'], { state: { supplierInvoice: supplierInvoice, supplierOrder: JSON.stringify(supplierOrder),supplier: supplier } });

  }
  public dataBound(e) {
    this.total = 0;
    this.totalHtt = 0;

    var details :  SupplierInvoiceItem[] = [];
    for (let index = 0; index < this.grid.getCurrentViewRecords().length; index++) {
      const element = this.grid.getCurrentViewRecords()[index] as SupplierInvoice;

      for (let index = 0; index < element.items.length; index++) {
        const item = element.items[index];
        details.push(item);

      }
    }
    this.childGrid.dataSource = details;
    this.grid.selectRow(0);
  }
  async validate(invoice) {

    let totalTTC = 0;
    invoice.items.forEach(async element => {
      totalTTC += await this.getLineTotalTTC(element)
    });
    console.log(totalTTC);
    let ecart =  (invoice.totalAmount)- totalTTC;
    if(ecart >1 || ecart < -1){
      this.notif.showNotification('mat-warn', 'l ecart de la facture est supérieur à 0', 'top', 'right');
    }else{
      let response = await this.dialogHelper.confirmDialog(this.dialog,'Êtes Vous sûr de bien vouloir valider la facture');
      if(response) {
          this.supplierInvoiceService.validateInvoice(invoice.id).subscribe(async result => {
          this.notif.showNotification('mat-success','Facture Fournisseur validée avec succès','top','right');
          this.loadData();
        }, (error) => {
            this.notif.showNotification('mat-warn',error,'top','right');
        });
      } else return null;
    }
  }
  async getLineTotalTTC(invoiceItem) {
    let tax = await this.productService.getTaxProduct(invoiceItem.productId).toPromise();

    if(invoiceItem.discount == null) invoiceItem.discount  = 0;
    return this.calculHelper.getTotalTTC(invoiceItem.purchaseUnitPrice, invoiceItem.quantity,invoiceItem.discount * 100, 0, tax );
  }
  async generateDeliveryReceipt( supplierInvoice : SupplierInvoice) {
    this.route.navigate(['/procurment/add-delivery-receipt/'], { state: {supplierInvoice:JSON.stringify(supplierInvoice), deliveryReceipt: null } });
  }

}
