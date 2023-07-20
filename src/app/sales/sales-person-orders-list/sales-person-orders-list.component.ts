import { ChangeDetectorRef, Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { OrdersService } from 'src/app/services/orders.service';
import { PermissionService } from 'src/app/services/permission.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { CustomerListComponent } from '../customer-list/customer-list.component';
import { Order } from '../sales-models/Order';
import { OrderItem } from '../sales-models/orderItem';
import { environment } from "src/environments/environment";
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { CommandClickEventArgs, CommandModel, DetailRowService, GridComponent, GridModel, RowSelectEventArgs } from '@syncfusion/ej2-angular-grids';
import { CustomerService } from 'src/app/services/customer.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { PreparationOrdersService } from 'src/app/services/preparation-orders.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { DialogHelper } from 'src/app/shared/DialogHelper';
import { DateHelper } from 'src/app/shared/date-helper';
import { ErrorParseHelper, Result } from 'src/app/shared/helpers/ErrorParseHelper';
@Component({
  selector: 'app-sales-person-orders-list',
  templateUrl: './sales-person-orders-list.component.html',
  styleUrls: ['./sales-person-orders-list.component.sass'],
  providers: [DetailRowService]
})
export class SalesPersonOrdersListComponent extends BaseComponent implements OnInit {
  isOpen: boolean = false;
  totalDiscount: number = 0;
  subscription: any;
  browserRefresh: any;
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
        if(!this.isOpen && this.permissionService.isSalesPerson()  ||this.permissionService.isSalesManager()||this.permissionService.isSupervisor()) this.add();
        else { 
          this.notif.showNotification('mat-warn',"vous n'êtes pas autorisé de créer une commande", null, null);
          return
        }
        break;
      case "Enter":
        event.preventDefault();         
        if(this.customerId && this.customerId.customerStatus =="Actif") {
          this.dialog.closeAll();
          this.route.navigate(['/sales/add-order/'], { state: { order: null, operation: 0 ,customerId: this.customerId } });
        }
        else  if(this.customerId && this.customerId.customerStatus !="Actif")  this.notif.showNotification('mat-warn',"Client en état bloqué", null, null);
          break;
      default:
        break;
    }
  }

  displayedColumns: string[] = [ 'orderNumber','customerName','orderType', 'orderDate','orderStatus','orderDiscount','orderTotal','createdDateTime','createdBy','expectedShippingDate','actions'];
  dataSource = new MatTableDataSource<Order>([]);
  public commandPending: CommandModel[];
  public commandListing: CommandModel[]; 

  public searchTerm = "";
  public cannotValidateProduct :any;
  @Output() dateChange:EventEmitter< MatDatepickerInputEvent< any>>;
  public data: DataManager;
  role: any;
  supplierId: any;
  isLoading: boolean = false;

  public start :Date ;
  public end : Date;
  public pageSettings: Object;
  public toolbar: object[];
  public dropStates: string[] = ["En attente","Confirmé / Imprimée","Enregistrée","Acceptée/Confirmée","En cours de traitement","En route","Terminée","Annulée","Rejetée","En cours de préparation","Consolidée","Expédiée","Créée sur AX","En cours de chargement", "Facturée","En cours de prélèvement", "Prélevée", "Accusé de réception", "Erreur de syncronisation", "Annulée sur AX", "Partiellement créée sur AX"];
  public fields: object = { text: 'orderStatus', value: 'orderStatus' };
  public dropTypesOrder: string[]  = ["Psychotrope", "Non Psychotrope"];
  public fieldType: object = { text: 'type', value: 'orderType' };
  pendingOrder : Order[] = [];
  range : FormGroup;
  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.grid.clearFiltering();
  }
  @HostListener('window:beforeunload', ['$event'])
 onWindowClose(event: any): void {
  // Do something
   localStorage.removeItem("ordersInEdition");
   event.preventDefault();

  //  event.returnValue = false;
}
  constructor( 
    private changeDetectorRef: ChangeDetectorRef,
    private service  : OrdersService,
    private customerService : CustomerService,
    private notif: NotificationHelper,
    private permissionService: PermissionService,
    private dialog: MatDialog,
    private dialogHelper: DialogHelper,
    private dateHelper: DateHelper,
    private fb: FormBuilder,
    private _auth: AuthService,
    private orderPreparationService : PreparationOrdersService,
    private parseErrorHelper: ErrorParseHelper,
    private orderService:OrdersService,
    private route: Router) {
    super(_auth,"sales/");
  }
    @ViewChild('grid') public grid: GridComponent;
    @ViewChild('grid2') public grid2: GridComponent;
    @ViewChild('detailgrid') public detailgrid: GridComponent;


  public onStrtChange(e) {
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "suppliers/"+this.supplierId+"/orders/search",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this._auth.getToken , "start" : this.dateHelper.toShorDate(e.target.value), "end" : null}],
      
    });
  }
  
  
  public onEndChange(e) {
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "suppliers/"+this.supplierId+"/orders/search",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this._auth.getToken , "start" : this.dateHelper.toShorDate(this.start), "end" : this.dateHelper.toShorDate(e.target.value)}],
      
    });
  }
  public total  : number = 0;
  public totalHtt  : number = 0;
  public dataBound(e) {

    this.total = 0;
    this.totalHtt = 0;

    var details :  OrderItem[] = [];
    for (let index = 0; index < this.grid.getCurrentViewRecords().length; index++) {
      const element = this.grid.getCurrentViewRecords()[index] as Order;
      if(element.orderStatus>=30)this.total +=  parseFloat((  element.orderTotal).toFixed(2));
      if(element.orderStatus>=30)this.totalHtt +=  parseFloat(( element.orderDiscount).toFixed(2));
      if(element.orderStatus>=30)this.totalDiscount +=  parseFloat(( element.totalDiscountHT).toFixed(2));

      for (let index = 0; index < element.orderItems.length; index++) {
        const item = element.orderItems[index];
        details.push(item);
      }
    }

    this.childGrid.dataSource = details;
  }
  dataBoundPending() {
    this.grid2.selectRow(0);
  }

  rowSelected(args: RowSelectEventArgs) {
    var row =this.grid2.getSelectedRecords()[0];
    this.detailgrid.dataSource = (row as Order).orderItems;
    this.detailgrid.refresh();    
  }

  async ngOnInit() { 
    this.pageSettings = { pageSizes: true, pageSize: 12 };
    this.range = this.fb.group({
      start: [this.start, []],
      end : [this.end , []]
    });
    this.supplierId = this._auth.profile["organizationId"];
     this.commandListing = [
      { type: 'None',title:'Détail', buttonOption: { iconCss: 'e-icons e-eye', cssClass: 'e-flat'} },
      // { type: 'None',title:'OP', buttonOption: { iconCss: 'e-icons e-arrow-right-up', cssClass: 'e-flat'}},
      { type: 'None',title:'Annuler',buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat'}},
      { type: 'None',title:'Imprimer une commande',  buttonOption: { iconCss: 'e-icons e-print', cssClass: 'e-flat'} },
    ];

    this.commandPending = [
      { type: 'None',title:'selectionner', buttonOption: { iconCss: 'e-icons e-edit', cssClass: 'e-flat'} },
       { type: 'None',title:'supprimer',buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat'} }
      
     ];
    console.log(this._auth.getToken);
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "suppliers/"+this.supplierId+"/orders/search",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this._auth.getToken , "start" : this.dateHelper.toShorDate(this.start), "end" : this.dateHelper.toShorDate(this.end)}],
    });
    if(this.permissionService.isSalesPerson() ||this.permissionService.isSalesManager() || this.permissionService.isSupervisor()){
      this.pendingOrder = <Order[]> await this.service.getAllPendingOrderSupplier(this.supplierId).toPromise();
    }
  }

  pendingCommandClick(args: CommandClickEventArgs): void {
    if(args.commandColumn.title == 'supprimer') this.deletePendingOrder(args.rowData);
    if(args.commandColumn.title == 'selectionner') {
      let order = args.rowData as Order;
      if(!order.orderItems  || order.orderItems.length == 0 ) {
        this.notif.showNotification('mat-success','La commande à été validé, veuillez créer une nouvelle commande','top','right');
        return;
      }
      let editOrders = JSON.parse(localStorage.getItem('ordersInEdition'));
     
      if(editOrders != null && editOrders.length) {
        let orderAlreadyOpened = editOrders.filter(c => c == order.id);

        if(orderAlreadyOpened.length >= 1) {
          this.notif.showNotification('mat-success','La commande est dejà ouverte dans une autre fenetre','top','right');
        } else {
         
          var id = (args.rowData as Order).customerId;
          this.customerService.getCustomerByIdForSalesPerson(id.toString()).subscribe(resp => {
            this.route.navigate(['/sales/add-order/'], { state: { order: (args.rowData as Order), operation: 0 ,customerId: resp } });
          }); 
        }
      } else {
        var id = (args.rowData as Order).customerId;
        this.customerService.getCustomerByIdForSalesPerson(id.toString()).subscribe(resp => {
          this.route.navigate(['/sales/add-order/'], { state: { order: (args.rowData as Order), operation: 0 ,customerId: resp } });
        }); 
      }
     
    } 
  }

  async deletePendingOrder(selectedOrder) {
    let response = await this.dialogHelper.confirmDialog(this.dialog,'Êtes Vous sûr de bien vouloir supprimer la commande en attente');
    if(response) {
      for (const element of selectedOrder.orderItems) {
        element.quantity = -1 * element.quantity;
        element.orderId = selectedOrder.id;
        element.supplierOrganizationId = selectedOrder.supplierId;
        element.customerId = selectedOrder.customerId;
        element.pickingZoneOrder = 0;
        let result = await this.service.updateItemV2(selectedOrder.id, element).toPromise();
        console.log(result);
        if(result != null) {
          let resultError = this.parseErrorHelper.parse(<Result>result);

          this.notif.showNotification('mat-success',resultError,'top','right');
        }
       
      }
      this.service.cancelPendingOrder(selectedOrder).subscribe(async res => {
        this.notif.showNotification('mat-success','La commande a été annulée avec succès','top','right');
        let orders = this.pendingOrder.filter(order => order.id != selectedOrder.id);
        this.pendingOrder = orders;
        // this.detailgrid.dataSource = [];
        this.detailgrid.refresh();

      }, (error) => {
        let resultError = this.parseErrorHelper.parse(<Result>error);

        this.notif.showNotification('mat-success',resultError,'top','right');
      });
    }
  }

  public childGrid: GridModel = {
    dataSource: [],
    queryString: 'orderId',
    width : "47%",
    columns: [
        { field: 'orderId', headerText: 'N°', textAlign: 'Right', width: 80 , visible : false},
        { field: 'productCode', headerText: 'Code', width: 100 },
        { field: 'productName', headerText: 'Nom',width: 250  },
        { field: 'unitPrice', headerText: 'P.U', width: 100 , type:"number", format:"N2"},
        { field: 'quantity', headerText: 'Qnt', width: 100 },
        { field: 'internalBatchNumber', headerText: 'N° lot', width: 100 },
        { field: 'expiryDate', headerText: 'DDP', width: 120 ,format:'dd/MM/yyyy', type:'date'},
        { field: 'ppaTTC', headerText: 'PPA TTC', width: 100 ,type:"number", format:"N2"},
        { field: 'discount', headerText: 'Remise', width: 100, type:"number", format:"N2"  },
        { field: 'extraDiscount', headerText: 'Remise.M', width: 100 , type:"number", format:"N2"},
        { field: 'acceptedOnAx', headerText: 'Ligne reservée',type:"boolean", width: 150 },
        { field: 'comment', headerText: 'Motif', width: 300 },
    ],
  };
  public childPendingGrid: GridModel = {
    dataSource: [],
    queryString: 'orderId',
    columns: [
        { field: 'orderId', headerText: 'N°', textAlign: 'Right', width: 80 , visible : false},
        { field: 'productCode', headerText: 'Code produit', width: 90 },
        { field: 'productName', headerText: 'Nom', width: 250 },
        { field: 'unitPrice', headerText: 'P.U', width: 150 , type:"number", format:"N2"},
        { field: 'quantity', headerText: 'Qnt', width: 150 },
        { field: 'internalBatchNumber', headerText: 'N° lot', width: 150 },
        { field: 'expiryDate', headerText: 'DDP', width: 150 ,format:'dd/MM/yyyy', type:'date'},
        { field: 'pfs', headerText: 'PPA', width: 150 ,type:"number", format:"N2"},
        { field: 'discount', headerText: 'Remise', width: 150, type:"number", format:"N2"  },
        { field: 'extraDiscount', headerText: 'Remise manuelle', width: 150 , type:"number", format:"N2"},
    ],
  };

  view(order) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { 
      order: order, 
    };
    dialogConfig.disableClose = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';
    if(!this.isOpen)  {
      var modalRef = this.dialog.open(OrderDetailComponent, dialogConfig);
      this.isOpen = true;
      modalRef.afterClosed().subscribe(res => {
        this.isOpen = false;
      });
    }
  }
  customerId: any;
  async add() {
    if( !this.permissionService.isSalesPerson() && !this.permissionService.isSalesManager()&& !this.permissionService.isSupervisor()) { 
      this.notif.showNotification('mat-warn',"vous n'êtes pas autorisé de créer une commande", null, null);
       return;
    }
    if(!this.isOpen ) {
      this.isOpen = true;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = "100vh";
      dialogConfig.height = "100%";
      dialogConfig.width = "100%";
      dialogConfig.panelClass= 'full-screen-modal'
      this.changeDetectorRef.detach(); // Detach change detection before the dialog opens. 

      var ref=  this.dialog.open(CustomerListComponent, dialogConfig);
      const sub = ref.componentInstance.onAdd.subscribe(res => {
        this.isOpen = false;
        if(res) this.customerId = res;
      });
      ref.afterClosed().subscribe(res => {
        this.changeDetectorRef.reattach(); // Detach change detection before the dialog opens. 

        if(!res)
        {
          this.isOpen = false;
          return;
        }
        this.route.navigate(['/sales/add-order/'], { state: { order: null, operation: 0 ,customerId: this.customerId } });
        this.isOpen = false;
      });
    }
   
   
  }
  async update(order) {
    this.route.navigate(['/sales/add-order/'], { state: { order: order, operation:1  } });
  }

  async ListingCommandClick(args: CommandClickEventArgs) {
    if(args.commandColumn.title == 'Détail') {this.view(args.rowData); return;}
    if(args.commandColumn.title == 'OP') {this.generateOps(args.rowData); return;}
    if(args.commandColumn.title == 'Imprimer') {this.print(args.rowData); return;}
    if(args.commandColumn.title == 'Imprimer une commande') {this.printOrder(args.rowData);return;}
    if(args.commandColumn.title == 'Annuler' && ((args.rowData as Order).orderStatus  == 30 ||(args.rowData as Order).orderStatus  == 40||(args.rowData as Order).orderStatus  == 90)) {
      let response = await this.dialogHelper.confirmDialog(this.dialog,'Êtes Vous sûr de bien vouloir supprimer la commande.');
      if(response){
        this.cancelOrder(args.rowData);
        return;
      }
    }
    else {
      this.notif.showNotification('mat-warn',"Vous ne pouvez pas annuler cette commande.",'top','right'); 
      return;
    }

  }
  async cancelOrder(rowData) {
   var r =  await this.service.empytOrder(rowData).toPromise();
   if(!r){
    this.notif.showNotification('mat-success',"Commande a été Annulée avec succès",'top','right');
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "suppliers/"+this.supplierId+"/orders/search",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this._auth.getToken , "start" : this.dateHelper.toShorDate(this.start), "end" : this.dateHelper.toShorDate(this.end)}],
    });
  }
    else this.notif.showNotification('mat-warn',this.parseErrorHelper.parse(<Result>r),'top','right');
  }
  async  printOrder(rowData) {
  var r =  await this.service.printOrder(rowData.id).toPromise();
  const file = new Blob([r], {type: 'application/pdf'});
  const fileURL = URL.createObjectURL(file);
  window.open(fileURL, '_blank', 'width=1000, height=800');
  //this.notif.showNotification('mat-success',"Commande Impriméé avec succès",'top','right');

  }
  async print(row) {
    await this.orderPreparationService.print(
      {
        ordersIds: [row.id]
      }
    )
    .toPromise();
    this.notif.showNotification('mat-success',"BL Imprimés avec succès",'top','right');
  }
  async generateOps(row){    
    if(row.orderStatus!=90){
    this.notif.showNotification('mat-warn',"Génération des OPs impossible !",'top','right');  
    return;
    }
    var response=

    await this.orderService.generateOps(
      {
        orderId: row.orderId
      }
    )
    .toPromise();
    if(response==null)
    {
      this.notif.showNotification('mat-success',"Ops générés avec succès",'top','right');
    }
    else
    { 
      let resultError = this.parseErrorHelper.parse(<Result>response);
      this.notif.showNotification('mat-warn',resultError,'top','right');   
    }
  }
}
