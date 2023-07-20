import { Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommandClickEventArgs, CommandModel, EditSettingsModel, GridComponent, GridModel, RowSelectEventArgs, SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DataManager } from "@syncfusion/ej2-data";
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionService } from 'src/app/services/permission.service';
import { ProductService } from 'src/app/services/product.service';
import { SupplierOrderService } from 'src/app/services/supplier-order.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { DialogHelper } from 'src/app/shared/DialogHelper';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { DetailSupplierOrderComponent } from '../detail-supplier-order/detail-supplier-order.component';
import { SupplierOrder } from '../models/SupplierOrder';
import { SupplierOrderItem } from '../models/SupplierOrderItem';
import { SupplierListComponent } from '../supplier-list/supplier-list.component';

@Component({
  selector: 'app-supplier-order-listing',
  templateUrl: './supplier-order-listing.component.html',
  styleUrls: ['./supplier-order-listing.component.sass']
})
export class SupplierOrderListingComponent extends BaseComponent implements OnInit  {

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
  @Output() onAdd = new EventEmitter();
  supplierId: any;
  pendingSupplierOrders: any = [];
  total: number;
  totalHtt: number;
  public editSettings: EditSettingsModel;
  public commandListing: CommandModel[];
  public commandPending: CommandModel[];

  public childGrid: GridModel = {
    dataSource: [],
    queryString: 'orderId',
    columns: [
        { field: 'orderId', headerText: 'N°', textAlign: 'Right', width: 80 , visible : false},
        { field: 'productCode', headerText: 'Code produit', width: 90 },
        { field: 'productName', headerText: 'Nom', width: 250 },
        { field: 'unitPrice', headerText: 'P.U', width: 150 , type:"number", format:"N2"},
        { field: 'quantity', headerText: 'Qnt', width: 150 },
        { field: 'invoicedQuantity', headerText: 'Qnt Facturé', width: 150 },
        { field: 'receivedQuantity', headerText: 'Qnt Reçu', width: 150 },
        { field: 'remainingQuantity', headerText: 'Qnt Rest', width: 150 },

        { field: 'minExpiryDate', headerText: 'DDP Souhaitée', width: 150 ,format:'dd/MM/yyyy', type:'date'},
        { field: 'discount', headerText: 'Remise', width: 150, type:"number", format:"N2"  },
        
    ],
  };
  isBuyer: boolean = false;
  isBuyerGroup: boolean = false;
  public dropStates: string[] = ["En attente","Enregistré","Acceptée","En cours de traitement","En route","Terminée","Annulée","Confirmée / Imprimée","Rejetée"];
  public fields: object = { text: 'orderStatus', value: 'orderStatus' };
  public dropTypesOrder: string[]  = ["Psychotrope", "Non Psychotrope"];
  public fieldType: object = { text: 'psychotropic', value: 'psychotropic' };
  @HostListener('resize', ['$event'])
  onResize(event) {
    var offsetHeight = event.target.innerHeight - 415 ;
    setTimeout(()=> {
      this.grid.height = offsetHeight + "px";
    }, 0);
  
  }
  constructor(
    private authService : AuthService,
    private supplierOrderService : SupplierOrderService,
    private supplierService : SupplierService,
    private notif: NotificationHelper,
    private dialog: MatDialog,
    private dialogHelper: DialogHelper,
    private permService: PermissionService,
    private productService: ProductService,
    private route: Router
  ) {
    super(authService,'supplier-orders/');
  }
  @HostListener('document:keydown', ['$event'])

  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case "F4":
        event.preventDefault();
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
 async ngOnInit() {
    this.loadData();
    this.selectionOptions = { checkboxMode: 'ResetOnRowClick'};
    this.getPendingSupplierOrders() ;
    this.commandListing = [
      { type: 'None',title:'Détail', buttonOption: { iconCss: 'e-icons e-edit', cssClass: 'e-flat'} },
      { type: 'None',title:'Imprimer', buttonOption: { iconCss: 'e-icons e-print', cssClass: 'e-flat'} },
    ];
    this.commandPending = [
      { type: 'None',title:'selectionner', buttonOption: { iconCss: 'e-icons e-edit', cssClass: 'e-flat'} },
       { type: 'None',title:'supprimer',buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat'} }
    ];
    this.isBuyer = this.permService.isBuyer();
    this.isBuyerGroup = this.permService.isBuyerGroup();
    this.loadData();
  }
  getPendingSupplierOrders() {
    this.supplierOrderService.getPendingSuppliersOrders(this.authService.profile["organizationId"]).subscribe(resp=> {
      this.pendingSupplierOrders  = resp;
    });  
  }
  
  public dataBound(e) {
    this.total = 0;
    this.totalHtt = 0;

    var details :  SupplierOrderItem[] = [];
    for (let index = 0; index < this.grid.getCurrentViewRecords().length; index++) {
      const element = this.grid.getCurrentViewRecords()[index] as SupplierOrder;
      if(element.orderStatus==30) this.total +=  parseFloat((  element.orderTotal).toFixed(2));
      if(element.orderStatus==30) this.totalHtt +=  parseFloat(( element.orderDiscount).toFixed(2));
      for (let index = 0; index < element.orderItems.length; index++) {
        const item = element.orderItems[index];
        details.push(item);
        
      }
    }
    this.childGrid.dataSource = details;
    this.grid.selectRow(0);
    this.grid.autoFitColumns();
  }
  ListingCommandClick(args: CommandClickEventArgs): void {
    console.log(args.commandColumn.title );
    if(args.commandColumn.title == 'Détail') this.view(args.rowData);

  }
  rowSelected(args: RowSelectEventArgs) {
    var row =this.grid2.getSelectedRecords()[0];
    this.detailgrid.dataSource = (row as SupplierOrder).orderItems;
    this.detailgrid.refresh();
    
  }
  async add() {
    if(!this.isOpen) {
      this.isOpen = true;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = "100vh";
      dialogConfig.height = "100%";
      dialogConfig.width = "100%";
      dialogConfig.panelClass= 'full-screen-modal';
      var ref=  this.dialog.open(SupplierListComponent, dialogConfig);
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
        this.route.navigate(['/procurment/add-supplier-order/'], { state: { order: null, operation: 0 ,supplier: this.supplierId } });
        this.isOpen = false;
      });
    }
  }
  async view(order) {
    var supplierOrder = await this.supplierOrderService.getById(order.id).toPromise();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { 
      supplierOrder: supplierOrder, 
    };
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';
    if(!this.isOpen)  {
      var modalRef = this.dialog.open(DetailSupplierOrderComponent, dialogConfig);
      this.isOpen = true;
      modalRef.afterClosed().subscribe(res => {
        this.isOpen = false;

      });
    }
  }

  async edit(order) {
    let pendingSupplierOrder ;
    pendingSupplierOrder = this.pendingSupplierOrders.find(ele => ele.id == order.id);
    if(pendingSupplierOrder == null ) pendingSupplierOrder = await this.supplierOrderService.getById(order.id).toPromise(); 
    let supplier = await this.supplierService.getSupplierByOrgId(order.supplierId).toPromise();
    this.route.navigate(['/procurment/add-supplier-order/'], { state: { order: pendingSupplierOrder, operation: 1 ,supplier: supplier } });

  }
  async delete(order) {
    let response = await this.dialogHelper.confirmDialog(this.dialog, 'Êtes Vous sûr de bien vouloir supprimer la commande');
    if(response) {
        this.supplierOrderService.deleteOrder(order.id).subscribe(async result => {
        this.notif.showNotification('mat-success','Commande Fournisseur supprimé avec succès','top','right');
        this.getPendingSupplierOrders();
        this.loadData();        
      }, (error) => {
          this.notif.showNotification('mat-warn',error,'top','right');
      });
    } else return null;
  }
  async validate(order) {
    let response = await this.dialogHelper.confirmDialog(this.dialog,'Êtes Vous sûr de bien vouloir valider la commande');
    if(response) {
        this.supplierOrderService.validateOrder(order.id).subscribe(async result => {
        this.notif.showNotification('mat-success','Commande Fournisseur validée avec succès','top','right');
        this.loadData();        
      }, (error) => {
          this.notif.showNotification('mat-warn',error,'top','right');
      });
    } else return null;
  }
  async reject(order) {
    let response = await this.dialogHelper.confirmDialog(this.dialog,'Êtes Vous sûr de bien vouloir rejeter la commande');
    if(response) {
        this.supplierOrderService.rejectOrder(order.id).subscribe(async result => {
        this.notif.showNotification('mat-success','Commande Fournisseur rejetée avec succès','top','right');
        this.loadData();        
      }, (error) => {
          this.notif.showNotification('mat-warn',error,'top','right');
      });
    } else return null;
  }
  async cancel(order) {
    let response = await this.dialogHelper.confirmDialog(this.dialog,'Êtes Vous sûr de bien vouloir rejeter la commande');
    if(response) {
        this.supplierOrderService.cancelOrder(order.id).subscribe(async result => {
        this.notif.showNotification('mat-success','Commande Fournisseur rejetée avec succès','top','right');
        this.loadData();        
      }, (error) => {
          this.notif.showNotification('mat-warn',error,'top','right');
      });
    } else return null;
  }
  async backToSavedStatus(order) {
    let response = await this.dialogHelper.confirmDialog(this.dialog,'Êtes Vous sûr de bien vouloir remettre la commande en brouillon');
    if(response) {
        this.supplierOrderService.backToSavedStatus(order.id).subscribe(async result => {
        this.notif.showNotification('mat-success','Commande Fournisseur en réedition avec succès','top','right');
        this.loadData();        

      }, (error) => {
          this.notif.showNotification('mat-warn',error,'top','right');
      });
    } else return null;
  }
  async finishOrder(order) {
    let response = await this.dialogHelper.confirmDialog(this.dialog,'Êtes Vous sûr de bien vouloir completer la commande');
    if(response) {
        this.supplierOrderService.finishOrder(order.id).subscribe(async result => {
        this.notif.showNotification('mat-success','Commande Fournisseur  complétée avec succès','top','right');
        this.loadData();        
      }, (error) => {
          this.notif.showNotification('mat-warn',error,'top','right');
      });
    } else return null;
  }
  async printOrder(order) {

        this.supplierOrderService.printOrder({
          orderIds: [order.id]
        }).subscribe(async result => {
        this.notif.showNotification('mat-success','Commande Fournisseur  Imprimée avec succès','top','right');
      })
     
  }
  pendingCommandClick(args: CommandClickEventArgs): void {
    if(args.commandColumn.title == 'supprimer') this.deletePendingOrder(args.rowData);
    if(args.commandColumn.title == 'selectionner') {
     this.edit(args.rowData);
    }
  }
  async deletePendingOrder(selectedOrder) {
    let response = await this.dialogHelper.confirmDialog(this.dialog,'Êtes Vous sûr de bien vouloir supprimer la commande');
    if(response) {
        this.supplierOrderService.deleteOrder(selectedOrder.id).subscribe(async result => {
        this.notif.showNotification('mat-success','Commande Fournisseur supprimé avec succès','top','right');
        this.loadData();
        this.getPendingSupplierOrders();        
      }, (error) => {
          this.notif.showNotification('mat-warn',error,'top','right');
      });
    } else return null;
  }
  // async confirmDialog(message,focusNo:boolean=true) {
  //   const dialogData = new ConfirmDialogModel("Avertissement", message,focusNo);
  //   const dialogRef = this.dialog.open(ConfimDialogComponent, {
  //     maxWidth: "400px",
  //     data: dialogData
  //   });

  //   let dialogResult = await dialogRef.afterClosed().toPromise();
  //   if(dialogResult)  return true;
  //   else return false;
  // }
  async generateInvoice( supplierOrder : SupplierOrder) {
    let supplier = await this.supplierService.getSupplierByOrgId(supplierOrder.supplierId).toPromise();
    this.route.navigate(['/procurment/add-supplier-invoice/'], { state: {supplierInvoice:null, supplierOrder: JSON.stringify(supplierOrder),supplier: supplier } });
  }
}
