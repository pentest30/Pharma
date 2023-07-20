
import {  Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, QueryList, ViewChild, ViewChildren , Renderer2, NgZone, Output, OnDestroy,ChangeDetectionStrategy,ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Navigation, NavigationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';
import { Product } from 'src/app/product/prodcut-models/product';
import { AuthService } from 'src/app/services/auth.service';
import { InventSumService } from 'src/app/services/inventory.service';
import { OrdersService } from 'src/app/services/orders.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { Customer } from 'src/app/tiers/customer/models/customer-model';
import { Supplier } from 'src/app/tiers/supplier/models/supplier-model';
import { ChangeExtraDiscountCommand, DiscountLine, OrderItem, OrderItemCreateCommand, SendOrderByPharmacistCommand, UpdateOrderDiscountCommandV2 } from '../sales-models/orderItem';
import * as uuid from 'uuid';
import { Order } from '../sales-models/Order';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { InventSum } from 'src/app/inventory/inventsum/models/inventsum-model';
import { MatSelect } from '@angular/material/select';
import { DiscountService } from 'src/app/services/discount.service';
import { Discount } from 'src/app/discounts/discount-models/Discount';
import * as Enumerable from "linq-es2015";
import { UserService } from 'src/app/services/user.service';

import { SearchProductComponent } from '../search-product/search-product.component';
import { MatButton } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { CommandClickEventArgs, CommandModel, DetailRowService, EditService, EditSettingsModel, GridComponent, GridModel, IEditCell, KeyboardEventArgs, row, RowSelectEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';

import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { CustomerListComponent } from '../customer-list/customer-list.component';
import { loadCldr, setCulture } from '@syncfusion/ej2-base';
import { AvailableProductsComponent } from '../available-products/available-products.component';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { QuotaService } from 'src/app/services/quota.service';
import { PermissionService } from 'src/app/services/permission.service';
import { CalculMethodHelper } from 'src/app/shared/CalculMethodHelper';
import { DialogHelper } from 'src/app/shared/DialogHelper';
import { ErrorParseHelper, Result } from 'src/app/shared/helpers/ErrorParseHelper';
import { PickingZoneService } from 'src/app/services/piking-zone.service';
import { ProductService } from 'src/app/services/product.service';
import { MatInput } from '@angular/material/input';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.sass'],
  providers: [DetailRowService,EditService],

  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),

  ],

})
export class AddOrderComponent implements OnInit{
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;
  @ViewChild(DatatableComponent, {static:false}) ngxDatatable: DatatableComponent;

  key: string;
  navigation: Navigation;
  operation: number = 1;
  scrolledProduct: Product;
  equivalenceOn: boolean = false;
  equivalenceProduct: Product;
  discounts: Discount[] = [];
  currentClient: any;
  orderAmount:number = 0;
  cachedOrders: Order[];
  defaultSalesPerson;
  globalRateMarque: number = 0;
  globalRateBenefit: number = 0;
  globalBenefit: number = 0;
  dataSourceCachedOrders= new MatTableDataSource<Order>([]);
  @ViewChild(MatPaginator, { static: true }) paginatorTab2: MatPaginator;

  isLoadingCached: boolean = false;
  displayedColumns: string[] = [ 'orderNumber','actions'];
  selectedTab: number = 0;
  currentIndex: any;
  @Output() onAdd = new EventEmitter();


  // Syncfusion params
  editSettings: { allowEditing: boolean; allowAdding: boolean; allowDeleting: boolean; mode: 'Batch'};
  gridLines: string;
  public toolbarItems: object[];
  public editOptions: EditSettingsModel;
  public filterSettings: Object;
  public commands: CommandModel[];
  public commandPending: CommandModel[];
  public numericParams: IEditCell;
  items: any[] = [];

  public pendingToolbarItems: object[];
  savingProcess: boolean = false;
  setFocus: any;
  totalTVACart: number;
  isSavingOrder: boolean;
  editOrders: any ;
  currentOrderId: any;
  @ViewChild("refDoc") refDocument: MatInput;
  eventsSubject: Subject<void> = new Subject<void>();
  eventsSubjectByProducts: Subject<void> = new Subject<void>();
  eventsSubjectByDebt : Subject<void> = new Subject<void>();
  selectedRowIndex: number = 0;
  // Fin snc fusion
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(event.key == 'F1') {
      event.preventDefault();

      if(this.selectedTab == 1) {
        this.selectedTab = 0;
        this.grid.selectRow(0);
      }
      else {
        this.selectedTab = 1;
        this.pendingGrid.selectRow(0);
      }
    }
    if(!this.dialogOpend) {
      switch (event.key) {

        case "+":
          if(this.selectedTab == 1) {
            event.preventDefault();
            let index = this.pendingGrid.selectedRowIndex;
            this.selectPendingOrder(this.cachedOrders[index]);
          }
          this.selectedCustomerid = undefined;
          if(this.form.value.customerId == null) {
            event.preventDefault();
            this.notif.showNotification('mat-danger','Merci de  selectionner votre client','top','right');
          } else {

            // this.ngProduct.last.nativeElement.focus();
            if(!this.grid.isEdit) {
              event.preventDefault();
              this.addOrderLine();
              this.searchProduct();
            }
          }
          break;
        case "-":
          if(!this.grid.isEdit) {
            event.preventDefault();
            let orderItem = this.rows[this.grid.selectedRowIndex];
            this.deleteOrderItem(orderItem);
          }
          break;


          case "F2":
          event.preventDefault();
          this.selectedCustomerid = undefined;
          if(!this.savingProcess) this.save();
          break;
        case "F3":
          event.preventDefault();
          this.selectedCustomerid = undefined;
          this.searchProduct();
          break;

          case "F4":
          event.preventDefault();
          this.selectedCustomerid = undefined;
          this.searchCustomer();
          break;

        case "F5":
          event.preventDefault();
          this.cancelOrder();
          break;
          case "F6":
            event.preventDefault();
            this.availableProducts();
            break;
        case "F9":
          var ele = document
            .getElementsByClassName("e-filtertext")
            .namedItem("productName_filterBarcell");
          setTimeout(() => (ele as HTMLElement).focus(), 0);
          break;
        case "F10":
          event.preventDefault();
          if(!this.dialogOpend) this.ApplyDiscount();
          break;
        case "F11":
          event.preventDefault();
          if(!this.dialogOpend) this.cancelApplyDiscount();
        break;
        case "F8":
          event.preventDefault();
          let order = new Order();
          order.supplierId = this.form.value.supplierId;
          order.customerId = this.form.value.customerId;
          order.expectedShippingDate = this.form.value.expectedShippingDate;
          order.orderTotal = this.getTotalTTCCart();
          order.orderDiscount = this.getTotalTTCCart() - this.getTotalTVACart() ;
          order.id = this.form.value.id;
          order.orderItems = this.rows;
          this.preview(order);
          break;
        case "Enter":

          if(this.selectedTab == 0 && this.selectedCustomerid != undefined) {
            event.preventDefault();
            this.dialog.closeAll();
            if(this.currentCustomer) this.onClientSelection(this.currentCustomer);
          }
          break;
        case "Delete" :{
          event.preventDefault();
          let index = this.pendingGrid.selectedRowIndex;
          this.deletePendingOrder(this.cachedOrders[index]);
        }
        default:
          break;
      }
    }


  }
  @HostListener('window:load', ['$event'])
  onLoad(event: Event) {
    this.route.navigate(['/sales/sales-person-orders']);


  }
  @HostListener('window:beforeunload')
  onBeforeUnload() {

    let editOrders = JSON.parse(localStorage.getItem('ordersInEdition'));
    if(editOrders && editOrders.length && this.form)  editOrders = editOrders.filter(c => c != this.currentOrderId);
   if(editOrders == null) editOrders = [];
   localStorage.setItem('ordersInEdition',JSON.stringify(editOrders));
    //return false;
  }
  public form: FormGroup;
  reservedBatch: any[] = [];
  ColumnMode = ColumnMode;

  suppliers: Supplier[] = [];
  rows: OrderItem[] = [];
  public formControl = new FormControl();
  public value: string;role: any;
  // products: Product[] = [];
  // cachedProduct: Product[] = [];
  customers: Customer[] = [];
  invent: InventSum[] = [];
  selected = [];
  SelectionType = SelectionType;
  selectedCustomer: string;
  searchActive : boolean = false;
  quotasByCustomer : any[] = [] ;
  zones : any[];
  @ViewChild('select') myElement: ElementRef;
  @ViewChildren('ngSelect') ngSelect:ElementRef;
  @ViewChild(MatSelect) orderType: MatSelect;
  @ViewChild('mydatatable') myTable1: DatatableComponent;
  @ViewChildren('ngProduct') ngProduct: QueryList<ElementRef>;
  @ViewChildren('ngInvent') ngInvent: QueryList<ElementRef>
  @ViewChild('headerElement', { read: ElementRef }) headerElement:ElementRef;
  @ViewChildren('ngdt') ngdt:ElementRef;
  @ViewChild('btnRef') buttonRef: MatButton;
  @ViewChild('batchgrid') public grid: GridComponent;
  @ViewChild('pendingGrid') public pendingGrid: GridComponent;
  @HostListener('resize', ['$event'])
  onResize(event) {
    var offsetHeight = event.target.innerHeight -480 ;
    setTimeout(()=> {
      this.grid.height = offsetHeight + "px";
    }, 0);

  }
  render : Renderer2;
  public extraDiscountRules: object;
  public quantityRules: object;
  customerId: string;
  public dateFormatOptions: any = {type:'date', format:'dd/MM/yyyy'};
  public readonly submittedValue: EventEmitter<void>;
  public childGrid: GridModel = {

    queryString: 'orderNumber',
    columns: [
        { field: 'productName', headerText: 'Order ID', textAlign: 'Right', width: 120 },
        { field: 'internalBatchNumber', headerText: 'Customer ID', width: 150 },
        { field: 'quantity', headerText: 'Ship City', width: 150 },
        { field: 'expiryDate', headerText: 'Ship Name', width: 150 }
    ],
  };

  createdBy : string;
  updatedBy : string ;
  dialogOpend = false;
  currentCustomer : Customer;
  selectedCustomerid : string;
  isPsy : boolean = false;
  private elem: any;

  constructor( private fb: FormBuilder,
    private notif: NotificationHelper,
    private route: Router,
    private ordersService: OrdersService,
    private userService: UserService,
    private inventoryService: InventSumService,
    private discountService: DiscountService,
    private permissionService: PermissionService,
    private _auth: AuthService,
    private calculHelper: CalculMethodHelper,
    private parseErrorHelper: ErrorParseHelper,
    private dialogHelper: DialogHelper,
    private quotaService : QuotaService,
    private productService : ProductService,
    private dialog: MatDialog,
    private zoneService: PickingZoneService
    ) {
      this.navigation = route.getCurrentNavigation();
      setCulture('fr');
      loadCldr(require('./../numbers.json'));
  }

  getActualHeight() {
    var actualWidth = window.innerHeight ||
                      document.documentElement.clientHeight ||
                      document.body.clientHeight ||
                      document.body.offsetHeight;
    return actualWidth;
  }

  customValidationFn (args) {
    if(args.value<=100 && args.value >=0){
      return true;
    } else
    return false;
  }
  customQuantityValidationFn(args) {
    console.log(Number.isInteger(eval(args.value)),eval(args.value) )
    if(!args.value.includes(',') && !args.value.includes('.')&& Number.isInteger(eval(args.value)) && eval(args.value) >= 1){
      return true;
    } else {
      return false;

    }
  }
   getActualHight() {
    var body = document.body;
    var html = document.documentElement;
    var bodyH = Math.max(body.scrollHeight, body.offsetHeight, body.getBoundingClientRect().height, html.clientHeight, html.scrollHeight, html.offsetHeight);
    return bodyH;
  }
  ngAfterViewInit(): void {
    var offsetHeight = this.getActualHeight() -450 ;
    setTimeout(()=> {
      if(this.grid && this.grid.height ) {
        this.grid.height = offsetHeight + "px";
        // this.grid.refresh();
      }
    }, 0);

  }
  async ngOnInit() {
    await this.createForm();
    this.route.events.subscribe(event =>{
      if (event instanceof NavigationStart){
        let editOrders = JSON.parse(localStorage.getItem('ordersInEdition'));
        if(editOrders!= null  && editOrders.length && this.form) editOrders = editOrders.filter(c => c != this.form.value.id);
        if(editOrders == null) editOrders = [];
        localStorage.setItem('ordersInEdition',JSON.stringify(editOrders));
      }
    });
    if(!this._auth.isAuthenticated)
      this._auth.signout();
    this.gridLines = 'Both';
    this.extraDiscountRules = { required:[this.customValidationFn,"Valeur comprise entre 0 et 100%"] };
    this.quantityRules = {required:[this.customQuantityValidationFn,"Valeur min  1"]};
    this.selectedTab = 0;
    this.filterSettings = { type: 'Menu' };
    this.toolbarItems = [
      { text: 'Ajouter Article (F3 / +)', tooltipText: 'Ajouter un Article', id: 'addarticle' },
      { text: 'Supprimer Article (-)', tooltipText: 'Sauvgarder la commande', id: 'deletearticle' },
      { text: 'Filtrer (F9)', tooltipText: 'Sauvgarder la commande',  id: 'filter' },
      { text: 'Sauvgarder (F2)', tooltipText: 'Sauvgarder la commande', id: 'saveorder' },
      { text: 'Annuler (F5)', tooltipText: 'Annuler',  id: 'cancelorder' },
      { text: 'Calcule Multi Ligne (F10)', tooltipText: 'Remise Multi Ligne',  id: 'multilinediscount' },
      { text: 'Annuler Multilignes (F11)', tooltipText: 'Annuler Multilignes', id: 'cancelApplyDiscount' , cssClass:'e-info'},
      { text: 'Fiche Client (F4)', tooltipText: 'Fiche Client',  id: 'clientdetail' , cssClass:'e-info'},
      { text: 'Fiche Article (F6)', tooltipText: 'Fiche Produit', id: 'available' , cssClass:'e-info'},
      { text: 'Visualiser (F8)', tooltipText: 'Visualiser', id: 'viewlines' , cssClass:'e-info'},
      { text: 'Exporter', tooltipText: 'Exporter', id: 'excelExport' , cssClass:'e-info'},

    ];
    this.pendingToolbarItems = [
      { text: 'Selectionner la commande (+)', tooltipText: 'Selectionner la commande', id: 'selectCommand' },
      { text: 'Supprimer la commande (Suppr)', tooltipText: 'Supprimer la commande',  id: 'deleteCommand' }
    ];
    this.editOptions = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };

    this.commands = [
      { type: 'None', buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat'} },
    ];
    this.commandPending = [
      { type: 'None',title:'supprimer',buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat'} },
      { type: 'None',title:'selectionner', buttonOption: { iconCss: 'e-icons e-edit', cssClass: 'e-flat'} },
    ];
    var  customer  : Customer;
    if(this.permissionService.isSalesPerson() ||this.permissionService.isSalesManager()||this.permissionService.isSupervisor()){
      if(this.navigation.extras.state) {
        this.customers.push(this.navigation.extras.state.customerId);
        this.customerId = this.navigation.extras.state.customerId.id;
        this.selectedCustomer = this.navigation.extras.state.customerId.id;
        customer = this.customers.find(x=>x.id == this.navigation.extras.state.customerId.id);
        this.onClientSelection( customer)
      }
    }

    this.createdBy =  this._auth.profile['userName'];
    // this.cachedProduct = <any>  (await this.dbService.getAll("products")).shift();
    this.onCommandTypeSelection(0);
    this.currentOrderId = this.form.value.id;
    if(customer && customer.organizationId) this.form.patchValue({organizationId : customer.organizationId });
    if(this.navigation.extras.state != null) {
      this.operation = this.navigation.extras.state.operation as number;
      let order = this.navigation.extras.state.order as Order;
      if(order!=null) {
        this.isPsy =  order.psychotropic;
        await this.setFromPendingOrder(order);
      }
    }
    this.selected = [this.rows[0]];
    this.role = this._auth.profile["role"];
    await this.getAllZones();

  }

  customSearchFn  (term: string, item: any) {
    if(term!=undefined) {
      term = term.toLocaleLowerCase();
      return (item.code != undefined && item.code.toLocaleLowerCase().indexOf(term) > -1)   ||  item.name.toLocaleLowerCase().indexOf(term) > -1;
    }
  }

  clickHandler(args: ClickEventArgs): void {

    if (args.item.id === 'addarticle') {
        this.searchProduct();
    }
    if (args.item.id === 'clientdetail') {
      this.searchCustomer();
    }
    if (args.item.id === 'cancelorder') {
      this.cancelOrder();
    }
    if (args.item.id === 'multilinediscount') {
      this.ApplyDiscount();
    }
    if (args.item.id === 'cancelApplyDiscount') {
      this.cancelApplyDiscount();
    }
    if (args.item.id === 'deletearticle') {
      let orderItem = this.rows[this.grid.selectedRowIndex];
      this.deleteOrderItem(orderItem);
    }
    if (args.item.id === 'excelExport') {
      this.grid.excelExport();
    }
    if (args.item.id === 'filter') this.filter();

    if (args.item.id === 'saveorder') this.save();
    if (args.item.id === 'available') this.availableProducts();
    if (args.item.id === 'viewlines') {
      let order = new Order();
      order.supplierId = this.form.value.supplierId;
      order.customerId = this.form.value.customerId;
      order.expectedShippingDate = this.form.value.expectedShippingDate;
      order.orderTotal = this.getTotalTTCCart();
      order.orderDiscount = this.getTotalTTCCart() - this.getTotalTVACart() ;
      order.id = this.form.value.id;
      order.orderItems = this.rows;
      this.preview(order);
    }

  }
  async cancelApplyDiscount() {
    let command = new UpdateOrderDiscountCommandV2();
    command.id = this.form.value.id;
    command.customerId = this.form.value.customerId;
    for (let index = 0; index < this.rows.length; index++) {
      const element = this.rows[index];

        //Apply multi discount
        let line  = new DiscountLine();
        line.productId = element.productId;
        line.discount = 0;
        line.internalBatchNumber = element.internalBatchNumber;
        command.DiscountLines.push(line)
        console.log(command);
    }
    await this.ordersService.applyMultiDiscount(command).toPromise();
    this.notif.showNotification("mat-success","Annulation de la remise multi ligne a été appliquée avec succès",'top','right');

    this.rows.map(async row => {
      row.discount = 0;
      return row;
    });
    this.grid.dataSource = this.rows;
    this.grid.refresh();

    this.updateListOrder();
    this.getGlobalBenefit();
  }

  clickPendingHandler(args: ClickEventArgs): void {
    let index = this.pendingGrid.selectedRowIndex;
    if (args.item.id === 'selectCommand') {
        this.selectPendingOrder(this.cachedOrders[index]);
    }
    if (args.item.id === 'deleteCommand') {
      this.deletePendingOrder(this.cachedOrders[index]);
    }

  }
  filter() {
    var ele = document
    .getElementsByClassName("e-filtertext")
    .namedItem("productCode_filterBarcell");
    setTimeout(() => (ele as HTMLElement).focus(), 0);
  }
  async getAllZones() {
    this.zones = await this.zoneService.getAll().toPromise();
  }
  created(){
    //this.searchProduct();
  }
  load(args) {
    document.getElementsByClassName('e-grid')[0].addEventListener('keydown', this.keyDownHandler.bind(this));
    this.grid.element.addEventListener('keypress', (e: KeyboardEventArgs) => {
      if(e.key == '*') {
        e.preventDefault();
        if ((e.target as HTMLElement).classList.contains("e-rowcell")) {
          if (this.grid.isEdit)
          this.grid.endEdit();

          let index: number = parseInt((e.target as HTMLElement).getAttribute("Index"));
          let colindex: number = parseInt((e.target as HTMLElement).getAttribute("aria-colindex"));
          let field: string = this.grid.getColumns()[colindex].field;
          let columns = <any[]>this.grid.columns;
          this.grid.selectRow(index);
          this.grid.startEdit();
          let focusColumns = columns.find(c => c.field == field);
          focusColumns.edit.obj.element.focus();
          this.setFocus = focusColumns;
        };
      }
    });

  }

  onDoubleClick(args: any): void{
    this.setFocus = args.column;  // Get the column from Double click event
  }

  actionComplete(args) {
    let  oldQuantity ;
    let oldExtraDiscount;
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      if(this.setFocus != null || this.setFocus != undefined )
      this.setFocus.edit.obj.element.focus();
      const Quantity = 'quantity';
      oldExtraDiscount = args.rowData['extraDiscount'];
      oldQuantity = args.rowData[Quantity];
      console.log(args);

    }
    if ((args.requestType === 'save')) {
      console.log(args.data);
      this.onQuantityChange(args.rowData, eval(args.data.quantity.toString()));
      if(args.rowData.extraDiscount != args.data.extraDiscount)
      this.onExtraDiscountChange(args.rowData, args.data.extraDiscount);
      var index = this.rows.findIndex(x=> x.id == args.rowData['id']);
      console.log(index);
      this.grid.selectRow(index);
      this.grid.selectedRowIndex = index;
    }
  }

  customProductSearchFn (term:string , item : any) {
   if(term!=undefined) {
    term = term.toLocaleLowerCase();
     return  (item.code != undefined && item.code.toLocaleLowerCase().indexOf(term) > -1 )  || (item.manufacturer != undefined && item.manufacturer.toLocaleLowerCase().indexOf(term) > -1 ) ||
    item.fullName.toLocaleLowerCase().indexOf(term) > -1;
   }
 }

  async setFromPendingOrder(cachedOrder ) {
    this.createdBy = cachedOrder.createdBy;
    this.updatedBy = cachedOrder.updatedBy;
    var  customer = this.customers.find(x=>x.id == cachedOrder.customerId);
    if(cachedOrder != null) {
      this.form.setValue({
        supplierId : cachedOrder.supplierId,
        orderDate : cachedOrder.orderDate,
        orderType : (cachedOrder.psychotropic) ? 1 : 0,
        expectedShippingDate : cachedOrder.expectedShippingDate ? cachedOrder.expectedShippingDate : new Date(),
        customerId : cachedOrder.customerId,
        organizationId : customer.organizationId,
        id: cachedOrder.id,
        refDocument : cachedOrder.refDocument ? cachedOrder.refDocument : "",
        toBeRespected: cachedOrder.toBeRespected,
        isSpecialOrder: !!cachedOrder.isSpecialOrder,
      });
      this.form.updateValueAndValidity();
      let rows = cachedOrder.orderItems;
      rows = rows.map(item => {
        item.id = uuid.v4();
        console.log(item.extraDiscount);

        item.extraDiscount = parseFloat((item.extraDiscount * 100).toFixed(4));
        console.log(item.extraDiscount);

        item.quantity = item.quantity.toString();
        item.discount = item.discount * 100;
        item.totalInlTax = this.calculHelper.getTotalTTC(item.unitPrice , eval(item.quantity), item.discount, item.extraDiscount, item.tax );
        let ht = this.calculHelper.getTotalHt(item.unitPrice, eval(item.quantity));
        let totalDiscount = this.calculHelper.getTotalDiscount(item.discount, item.extraDiscount, ht);
        item.totalExlTax = ht - totalDiscount;
        item.discountValue = totalDiscount;
        this.getDiscountsOrder(item);
        return item;
      });
      console.log(rows);
      this.rows = [];
      this.rows = rows;
      if(this.grid)
      this.grid.selectRow(0);
      this.onCommandTypeSelection(this.form.value.orderType);
      this.getGlobalBenefit();
      this.editOrders = JSON.parse(localStorage.getItem("ordersInEdition"));
      if(this.editOrders == null) this.editOrders = [];
      this.editOrders.push(this.form.value.id);
      this.editOrders = this.editOrders.filter((n, i) => this.editOrders.indexOf(n) === i);
      localStorage.setItem("ordersInEdition", JSON.stringify(this.editOrders));
      this.currentOrderId = this.form.value.id;

    }
  }
  async specialOrder($event) {
    await this.ordersService.updateSpecialOrder(this.form.value.id, this.form.value.customerId).toPromise();
  }
  public dataBound(e) {
    this.grid.selectRow(this.selectedRowIndex);
    this.grid.height = window.innerHeight - 480;
  }
  dataBoundPending(e) {
    try {
      this.pendingGrid.selectRow(0);
      this.grid.height = window.innerHeight - 450;
    if (document.getElementsByClassName('e-grid')) document.getElementsByClassName('e-grid')[0].addEventListener('keydown', this.keyDownHandler.bind(this));
    } catch (error) {

    }
  }


  availableProducts () {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    var ref=  this.dialog.open(AvailableProductsComponent);
  }
  searchCustomer () {

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = "100vh";
      dialogConfig.height = "100%";
      dialogConfig.width = "100%";
      dialogConfig.panelClass= 'full-screen-modal';
      var ref=  this.dialog.open(CustomerListComponent,dialogConfig);
      const sub = ref.componentInstance.onAdd.subscribe(res => {

      if(res)
      if(this.editOrders == null) this.editOrders = [];
      let oldOrderId= this.form.value.id;
      this.editOrders = this.editOrders.filter(c => c != oldOrderId);
      localStorage.setItem("ordersInEdition", JSON.stringify(this.editOrders));
        this.form.reset();
        this.selectedCustomer = res.id;
        this.selectedCustomerid = res.id;
        this.editOrders = JSON.parse(localStorage.getItem("ordersInEdition"));

        this.form.patchValue({
          id: uuid.v4(),
          supplierId: this._auth.profile.organizationId,
          orderDate: new Date(),
          expectedShippingDate: new Date(),
          customerId: res.id,
          orderType: 0,
          organizationId: null,
          toBeRespected: false,
          isSpecialOrder: false
        });
        this.editOrders.push(this.form.value.id);
        this.editOrders = this.editOrders.filter((n, i) => this.editOrders.indexOf(n) === i);
        localStorage.setItem("ordersInEdition", JSON.stringify(this.editOrders));
        this.rows = [];
        this.customers = [];
        this.customers.push(res);
        this.currentCustomer = res;
        this.currentClient =   res;
      });
      ref.afterClosed().subscribe(res => {
      })



  }
  getIndexRow(index) {
    return parseInt(index) + 1 ;
  }
  searchProduct() {

    const dialogConfig = new MatDialogConfig();
    this.form.value.orderType =  this.isPsy? 1 : 0;
    dialogConfig.data = {
      form: this.form.value,
      rows: this.rows,
      zones: this.zones,
      currentClient : this.currentClient,
    };
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';
    if(!this.dialogOpend)  {
      var modalRef = this.dialog.open(SearchProductComponent, dialogConfig);
      this.dialogOpend = true;
      modalRef.afterClosed().subscribe(res => {

        this.dialogOpend = false;
        this.grid.selectRow(0);
        if(res != null) {
          if(this.rows.length == 0) {
            this.form.get('orderType').setValue((res.orderType ) ? 1 : 0);
            this.isPsy = (this.form.value.orderType == 1) ? true : false;
          }
          let zone = this.zones.find(z => z.id == res.pickingZoneId);
          let orderItem = new OrderItem();
          orderItem.id = uuid.v4();
          orderItem.productId = res.productId;
          orderItem.expiryDate = res.expiryDate;
          orderItem.productName = res.productName;
          orderItem.productCode = res.productCode;
          orderItem.pickingZoneId = res.pickingZoneId;
          orderItem.pickingZoneName = (zone != null) ? zone.name: null;
          orderItem.zoneGroupId = (zone != null) ? zone.zoneGroupId: null;
          orderItem.zoneGroupName = (zone != null) ? zone.zoneGroup?.name: null;
          orderItem.purchaseUnitPrice = res.purchaseUnitPrice;
          orderItem.internalBatchNumber = res.internalBatchNumber;
          orderItem.extraDiscount = res.extraDiscount;
          orderItem.customerId = this.form.value.customerId;
          orderItem.unitPrice = res.unitPrice;
          orderItem.quantity = res.quantity.toString();
          orderItem.ppaPFS = res.ppaPFS;
          orderItem.pfs = res.pfs;
          orderItem.discount = res.discount;
          orderItem.tax = res.tax;
          orderItem.packing = res.packing;
          orderItem.totalInlTax = this.calculHelper.getTotalTTC(orderItem.unitPrice , orderItem.quantity, orderItem.discount, orderItem.extraDiscount, orderItem.tax );
          let ht = this.calculHelper.getTotalHt(orderItem.unitPrice, orderItem.quantity);
          let totalDiscount = this.calculHelper.getTotalDiscount(orderItem.discount, orderItem.extraDiscount, ht);
          orderItem.totalExlTax = ht - totalDiscount;
          orderItem.discountValue = totalDiscount
          this.getDiscountsOrder(orderItem);
          this.rows = [...this.rows,orderItem];
          if(this.rows.find(c => c.discount != null && c.discount != 0) != null ) {
            setTimeout(() => {
              this.ApplyDiscount();
            }, 100);
          }

          this.selected = [];
          this.selected = [...this.selected,orderItem];
          this.getGlobalBenefit();
          var index = this.rows.findIndex(x=> x.id == orderItem.id);
          this.selectedRowIndex = index;
        }
      });

    }
  }
  keyDownHandler(e: KeyboardEventArgs) {
    if (e.key === 'F2') {
      e.preventDefault();
      this.grid.endEdit();
      e.cancel = true;
    }
  }

  async onClientSelection(event) {
    this.currentClient = event;
    this.defaultSalesPerson =this.currentClient.defaultSalesPerson? await this.userService.getById(this.currentClient.defaultSalesPerson).toPromise() : "";
    this.cachedOrders = <Order []> await this.ordersService.GetSalesPersonPendingOrders(event.id).toPromise();
    if(this.cachedOrders.length) {
      let data = this.cachedOrders.filter(ele => ele.psychotropic == (this.form.value.orderType == 0) ? false : true );
      this.cachedOrders = data;
    }
    this.isLoadingCached = false;
    if(!this.cachedOrders || this.cachedOrders.length == 0){
      return;
    }
  }
  keyPressed(e) {
    if (e.key === "Enter") {
       this.onAdd.emit(this.cachedOrders[this.grid.selectedRowIndex]);
      return;
    }
  }
  rowSelected(args) {
    let data = args.data;
    this.items = data.orderItems;
  }
  onActivate(event) {
    if (event.type === "keydown" && event.event.key === "ArrowDown") {
      if (this.rows.length - 1 > this.currentIndex) {
        this.currentIndex++;
        this.selected = [this.rows[this.currentIndex]];
      }
    } else {
      if (event.type === "keydown" && event.event.key === "ArrowUp") {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.selected = [this.rows[this.currentIndex]];
        }
      }
    }
  }
  async addOrderLine() {
    let orderAmount =  this.getTotalTTCCart();
    if(this.currentClient.limitCredit == 0) this.searchProduct();
    else {
      let canDoOrder = this.currentClient.limitCredit - (this.currentClient.debt + orderAmount);
      if(canDoOrder < 0) this.notif.showNotification('mat-warn',"Le client a atteint sa limite de crédit " + (this.currentClient.limitCredit) ? this.currentClient.limitCredit : 0  + "DA",'top','right');
      else  this.searchProduct();
    }
  }

  onCommandTypeSelection(commandType) {
    this.isPsy = commandType == 1;
  }

  async getDiscountsOrder(orderItem) {
      let alreadyExist = this.discounts.filter(ele => ele.productId == orderItem.productId);
      if(alreadyExist == null) {
        let discount = <Discount[]> await this.discountService.getActive(orderItem.productId).toPromise();
        let newArray = this.discounts.concat(discount);
        this.discounts = newArray;
      } else {
        let discount = <Discount[]> await this.discountService.getActive(orderItem.productId).toPromise();
        let newArray = this.discounts.concat(discount);
        this.discounts = newArray;
      }
  }
  async ApplyDiscount() {
    var linq = Enumerable.From(this.rows);
    var result = linq.GroupBy(x => x.productId)
            .Select(function(x) { return {
              productId: x.key,
              quantity: linq.Where(y => y.productId == x.key).Sum(x => parseInt(x.quantity.toString())) ,
              discount: null

            };}).ToArray();
    result.map(ele => {
      let discount =  this.discounts.find(disc => disc.productId == ele.productId && ele.quantity >= disc.thresholdQuantity);
      if(discount != null) {
        ele.discount = discount.discountRate;
      }

      return ele;
    });
    let command = new UpdateOrderDiscountCommandV2();
    command.id = this.form.value.id;
    command.customerId = this.form.value.customerId;
    for (let index = 0; index < this.rows.length; index++) {
      console.log(index, this.rows[index]);
      const element = this.rows[index];
      let discount =  result.find(disc => disc.productId == element.productId);
        element.discount = discount.discount * 100;
        //Apply multi discount
        let line  = new DiscountLine();

        line.productId = element.productId;
        line.discount = (discount != null && discount.discount != null ) ? discount.discount : 0;
        line.internalBatchNumber = element.internalBatchNumber;
         command.DiscountLines.push(line)
        console.log(command);
    }
    let response = await this.ordersService.applyMultiDiscount(command).toPromise();
        if(response == null) {
          this.notif.showNotification("mat-success","Les remise multi ligne a été appliquée avec succès",'top','right');
          this.getGlobalBenefit();

        } else {
          let resultError = this.parseErrorHelper.parse(<Result>response);
          this.notif.showNotification('mat-warn','La validation de la commande a échouée ' + resultError,'top','right');

        }

    this.rows.map(row => {
      let discount =  result.find(disc => disc.productId == row.productId);
      if(discount != null && discount.discount != null) {
        row.discount = discount.discount * 100;
        let ht = this.calculHelper.getTotalHt(row.unitPrice, row.quantity);
        let totalDiscount = this.calculHelper.getTotalDiscount(row.discount, row.extraDiscount, ht);
        row.discountValue = totalDiscount;
      }
      return row;
    });
    this.grid.dataSource = this.rows;
    this.grid.refresh();

    this.updateListOrder();
  }
  updateListOrder() {

    let tempRows = this.rows;
    this.rows = [];
    this.rows = tempRows;
    this.getGlobalBenefit();
  }


  async onQuantityChange(element,quantity) {
    let isQuota = await this.productService.productIsQuota(element.productId).toPromise();
    let oldQnt = quantity;
    // Product Quota Case

    if(isQuota) {
      this.quotasByCustomer = await this.quotaService.getQuotabyProductId(element.productId).toPromise();
      console.log(this.quotasByCustomer);
      var item = this.quotasByCustomer.find(x=>x.productId == element.productId && isQuota);

      if (item !=null && item != undefined && parseInt(item.availableQuantity) + parseInt(element.quantity) < quantity) {
        this.notif.showNotification('mat-warn',"La quantité ne doit pas être superieure à la quantité quota, Quantité quota restante égale = " +  item.availableQuantity ,'top','right');
        item.quantity = oldQnt;
        this.updateRows(element);
        return;
      }else if(!item && isQuota ) {
        this.notif.showNotification('mat-warn',"Le produit n'est pas encore distribué "  ,'top','right');
        //element.quantity = oldQnt;
        console.log(element);

        this.updateRows(element);
        return;
      }
    }
    // End Quota Case
    let canSave =   this.checkOverTakingCredit();
    if(!canSave ) {
      let rows = this.rows.map(ele => {
        if(ele.id == element.id) return element
        else return ele;
      });

      this.rows = rows;
      this.notif.showNotification('mat-warn',"Le client a atteint sa limite de crédit " + this.currentClient.limitCredit + "DA",'top','right');
    } else {
      let oldElement = Object.assign({}, element);

      if(quantity > 0 && element.quantity != quantity) {
        element.quantity = parseInt(quantity) ;
        let ht = this.calculHelper.getTotalHt(element.unitPrice, element.quantity);
        let totalDiscount = this.calculHelper.getTotalDiscount(element.discount, element.extraDiscount, ht);
        element.totalExlTax = ht - totalDiscount;
        element.totalInlTax = this.calculHelper.getTotalTTC(element.unitPrice , element.quantity, element.discount, element.extraDiscount, element.tax );
        element.customerId = this.form.value.customerId;
        let orderItemCommand = this.CreateOrderItem(element);
        element.totalDiscount = this.getDiscountsOrder(element);

        this.updateItem(orderItemCommand, oldElement);
        this.getGlobalBenefit();
        this.updateRows(element);
        if(this.rows.find(c => c.discount != null && c.discount != 0) != null )
        this.ApplyDiscount();
      }
    }
  }
  updateRows (item : OrderItem) {
    var index = this.rows.findIndex(x=> x.id == item.id);
    if(index> -1) {

      (this.grid.dataSource as object[]).splice(index, 1);
      (this.grid.dataSource as object[]).splice(index, 0, item);
      this.grid.refresh();
      this.selectedRowIndex = index;

    }
  }
  onExtraDiscountChange(element,extraDiscount) {
    if(extraDiscount <= 100) {
      element.extraDiscount = extraDiscount;
      let ht = this.calculHelper.getTotalHt(element.unitPrice, element.quantity);
      let totalDiscount = this.calculHelper.getTotalDiscount(element.discount, element.extraDiscount, ht);
      element.totalExlTax = ht - totalDiscount;
      element.totalInlTax = this.calculHelper.getTotalTTC(element.unitPrice , element.quantity, element.discount, element.extraDiscount, element.tax );
      element.discountValue = totalDiscount;

      let command = new ChangeExtraDiscountCommand();
      command.id = this.form.value.id;
      command.productId = element.productId;
      command.discount = parseFloat(extraDiscount) /100;
      command.internalBatchNumber = element.internalBatchNumber;
      command.customerId = this.form.value.customerId;
      this.updateExtraDiscount(command);
      this.getGlobalBenefit();
      this.updateRows(element);
    } else {
      this.notif.showNotification('mat-warn','La remise ne doit pas être superieure à 100 %','top','right');
    }
  }
  async updateExtraDiscount(command: ChangeExtraDiscountCommand) {
    let result = await this.ordersService.updateExtraDiscount(command).toPromise();
    if(result == null) {
      this.notif.showNotification('mat-success','Remise mise à jour avec succès','top','right');
      this.getGlobalBenefit();
    } else {
      let resultError = this.parseErrorHelper.parse(<Result>result);

      this.notif.showNotification('mat-warn',resultError,'top','right');

    }

    // this.ordersService.updateExtraDiscount(command).subscribe(result => {
    //   this.notif.showNotification('mat-success','Remise mise à jour avec succès','top','right');
    //   this.getGlobalBenefit();

    // }, (error) => {
    //     this.notif.showNotification('mat-warn',error,'top','right');
    // });
    // this.getGlobalBenefit();
  }
  updateItem(orderItemCommand,element) {
    let quantity = 0;
    this.rows.forEach(p => {
      if(p.productId == orderItemCommand.productId && p.internalBatchNumber == orderItemCommand.internalBatchNumber ) {
        quantity = quantity + eval(p.quantity.toString());
      }
    });
    orderItemCommand.quantity = quantity;
    if (orderItemCommand.discount > 1)  orderItemCommand.discount = orderItemCommand.discount / 100 ;
    if (orderItemCommand.discount == null) orderItemCommand.discount = 0;

    if (orderItemCommand.extraDiscount >= 1) orderItemCommand.extraDiscount = orderItemCommand.extraDiscount / 100;
    if (orderItemCommand.extraDiscount == null) orderItemCommand.extraDiscount = 0;


    this.ordersService.updateItemV2(this.form.value.id,orderItemCommand).subscribe(result => {
      this.notif.showNotification('mat-success','Quantité mise à jour avec succès','top','right');
      this.getGlobalBenefit();
    }, (error) => {
      let rows = this.rows.map(ele => {
        if(ele.id == element.id) return element
        else return ele;
      });
      this.rows = rows;
      this.notif.showNotification('mat-warn',error,'top','right');
    });
    this.getGlobalBenefit();
  }
  CreateOrderItem(element) {

    let command = new OrderItemCreateCommand();
    command.orderId = this.form.value.id;
    command.customerId = this.form.value.customerId;
    command.productId = element.productId;
    command.productCode = element.productCode;
    command.toBeRespected = this.form.value.toBeRespected;
    command.specialOrder = this.form.value.isSpecialOrder;
    command.id = element.id;
    command.quantity = element.quantity;
    command.extraDiscount = element.extraDiscount * 100;
    command.internalBatchNumber = element.internalBatchNumber;
    command.supplierOrganizationId = this._auth.profile.organizationId;
    return command;
  }
  commandClick(args: CommandClickEventArgs): void {
    this.deleteOrderItem(args.rowData)
  }
  pendingCommandClick(args: CommandClickEventArgs): void {
    if(args.commandColumn.title == 'supprimer') this.deletePendingOrder(args.rowData);
    if(args.commandColumn.title == 'selectionner') this.selectPendingOrder(args.rowData);
  }
  async deleteOrderItem(orderItem) {
    orderItem.customerId = this.form.value.customerId;
    let response = await this.dialogHelper.confirmDialog(this.dialog,'Êtes Vous sûr de bien vouloir supprimer le produit');
    if(response) {
      let quantity = 0;
      let count = 0;
      for (let index = 0; index < this.rows.length; index++) {
        const element = this.rows[index];

        if(element.productId == orderItem.productId && element.internalBatchNumber == orderItem.internalBatchNumber ) {
          count += 1;
          quantity += eval(element.quantity.toString());
        }
      }
      let deleteCommand = this.CreateOrderItem(orderItem);

      deleteCommand.quantity = (count == 1) ? -1 * eval(orderItem.quantity.toString())  : quantity - eval(orderItem.quantity.toString());
      await this.ordersService.updateItemV2(this.form.value.id, deleteCommand).subscribe(result => {
        this.notif.showNotification('mat-success','Produit supprimé avec succès','top','right');
        let rows= this.rows.filter(item => item.id != orderItem.id );
        this.rows = rows;
        this.getGlobalBenefit();
        if(this.rows.find(c => c.discount != null && c.discount != 0) != null )
        this.ApplyDiscount();

      }, (error) => {
          this.notif.showNotification('mat-warn',error,'top','right');
      });
    } else return null;
  }
  async deleteWithoutConfirmation(orderItem) {
    let deleteCommand = this.CreateOrderItem(orderItem);
    deleteCommand.quantity = -1 * eval(orderItem.quantity.toString());
    await this.ordersService.updateItemV2(this.form.value.id, deleteCommand).toPromise();
    let rows = this.rows.filter(item => item.id != orderItem.id );
    this.rows = rows;
    this.getGlobalBenefit();

  }
  checkOverTakingCredit() {
    let orderAmount =  this.getTotalTTCCart();
    if(this.currentClient.limitCredit == 0) return true;
    else {
      let canDoOrder = this.currentClient.limitCredit - (this.currentClient.debt + orderAmount);
      if(canDoOrder < 0) return false ; else return true;
    }
  }
  getTotalTTCCart() {
    return this.calculHelper.getTotalTTCCart(this.rows);
  }
  getTotalTVACart() {
    this.totalTVACart =  this.calculHelper.getTotalTVACart(this.rows);
    return this.totalTVACart;
  }
  getTotalDiscountCart() {
    return this.calculHelper.getTotalDiscountCart(this.rows);
  }
  getGlobalLineBenefit(orderItem) {
    let quantity = eval(orderItem.quantity.toString());
    let ht = this.calculHelper.getTotalHt(orderItem.unitPrice , quantity);
    let totalDiscount = this.calculHelper.getTotalDiscount(orderItem.discount, orderItem.extraDiscount, ht);
    return  (ht- totalDiscount) - (quantity * orderItem.purchaseUnitPrice);
  }
  getRateBenfitLine(orderItem) {
    return this.getGlobalLineBenefit(orderItem) / (orderItem.quantity * orderItem.purchaseUnitPrice);
  }
  getRateMarqueLine(orderItem) {
    let extraDiscount = (orderItem.extraDiscount == undefined) ? 0 : orderItem.extraDiscount / 100;
    let discount = (orderItem.discount == undefined) ? 0 : orderItem.discount / 100;
    let salesDiscountPrice = orderItem.unitPrice * (1 - (discount + extraDiscount));
    let rate = this.getGlobalLineBenefit(orderItem) / (orderItem.quantity * salesDiscountPrice);
    return rate;
  }

  getGlobalBenefit() {
    let sumPurchase = 0;
    let sumSalesPrice = 0;
    this.globalBenefit = 0;
    if(this.rows.length) {
      for (let index = 0; index < this.rows.length; index++) {
        const row = this.rows[index];
        let lineBenefit = this.getGlobalLineBenefit(row);
        this.globalBenefit = this.globalBenefit + lineBenefit;
        let extraDiscount = (row.extraDiscount == undefined) ? 0 : row.extraDiscount / 100;
        let discount = (row.discount == undefined) ? 0 : row.discount / 100;
        let discountSalePrice = row.unitPrice * (1 - (discount + extraDiscount));
        sumPurchase = sumPurchase + (eval(row.quantity.toString()) * row.purchaseUnitPrice);
        sumSalesPrice = sumSalesPrice + (eval(row.quantity.toString()) * discountSalePrice);
      }
    }
    this.globalRateBenefit = this.globalBenefit ? parseFloat(((this.globalBenefit / sumPurchase) * 100).toFixed(2)) : 0;
    this.globalRateMarque = this.globalBenefit ? parseFloat(((this.globalBenefit / sumSalesPrice) * 100).toFixed(2)) : 0;
  }
  getBenefitValue() {
    let benefit = 0;
    if(this.rows.length) {
      for (let index = 0; index < this.rows.length; index++) {
        const row = this.rows[index];
        let lineBenefit = this.getGlobalLineBenefit(row);
        benefit += lineBenefit;
      }
    }
    return benefit;
  }
  createForm() {
    this.form = this.fb.group({
      customerId: [null, [Validators.required]],
      organizationId: [null, []],
      id: [uuid.v4(), []],
      orderType: [0, [Validators.required]],
      orderDate: [new Date(), [Validators.required]],
      supplierId: [this._auth.profile.organizationId, [Validators.required]],
      expectedShippingDate: [new Date(), [Validators.required]],
      refDocument : [null, []],
      toBeRespected: [false, Validators.required],
      isSpecialOrder: [false, Validators.required]

    });


  }

  async save() {
    this.getGlobalBenefit();
    //let totalbenefit = this.getBenefitValue();
    let totalTTC = this.getTotalTTCCart();
    let negativeMarque = this.rows.filter(c => this.getRateMarqueLine(c) < 0 );
    console.log(negativeMarque);
    if(negativeMarque && negativeMarque.length > 0) {
      this.notif.showNotification('mat-warn',"Veuillez rectifier les lignes avec marges négative",'top','right');
      return;
    }
    if(this.form.valid && this.rows && this.rows.length > 0  ) {
      if(this.form.value.orderType == 1 && (this.form.value.refDocument == null || this.form.value.refDocument == '' || this.form.value.refDocument.length == 0)) {

        this.form.controls["refDocument"].setValidators([Validators.required]);
        this.form.controls["refDocument"].updateValueAndValidity();
        this.form.controls["refDocument"].markAllAsTouched();
        this.notif.showNotification('mat-warn',"Veuillez saisir la référence document ",'top','right');
        return;
      }
      this.dialog.closeAll();
      this.savingProcess = true;
      let canSave;
      let orderAmount =  totalTTC;
      if(this.currentClient.limitCredit == 0)  canSave =  true;
      else {
        let canDoOrder = this.currentClient.limitCredit - (this.currentClient.debt + orderAmount);
        if(canDoOrder < 0) canSave = false ; else canSave = true;

      }
      if(!canSave ) {
        this.notif.showNotification('mat-warn',"Le client a atteint sa limite de crédit " + this.currentClient.limitCredit + "DA",'top','right');
      } else {
        let confirm = await this.dialogHelper.confirmDialog(this.dialog,'Êtes-vous sûr de vouloir sauvegarder', false);
        if(confirm && !this.isSavingOrder ) {

          let totalTVA = this.getTotalTVACart();
          let order = new SendOrderByPharmacistCommand();
          order.supplierId = this.form.value.supplierId;
          order.customerId = this.form.value.customerId;
          order.toBeRespected = this.form.value.toBeRespected;
          order.isSpecialOrder = this.form.value.isSpecialOrder;
          order.expectedShippingDate = this.form.value.expectedShippingDate;
          order.ttc = totalTTC;
          order.tht = totalTTC - totalTVA;
          order.orderBenefit = (this.globalBenefit == null) ? 0 : this.globalBenefit;
          order.orderBenefitRate = this.globalRateBenefit;
          order.id = this.form.value.id;
          order.refDocument = this.form.value.refDocument;
          this.isSavingOrder = true;
          var result =  await this.ordersService.send(order).toPromise();

          //this.notif.showNotification('mat-success','La validation de la commande a été terminée avec succès','top','right');
           //this.route.navigate(["/sales/sales-person-orders"]);

           if(result == null) {
             this.isSavingOrder = false;
             this.notif.showNotification('mat-success','La validation de la commande a été terminée avec succès','top','right');
             this.route.navigate(["/sales/sales-person-orders"]);

           } else {
             let resultError = this.parseErrorHelper.parse(<Result>result);

             this.notif.showNotification('mat-warn',resultError ,'top','right');
             this.savingProcess = true;
             this.isSavingOrder = false;
             return

           }

          // this.ordersService.send(order).subscribe( result => {
          //   if(result == null) {
          //     this.isSavingOrder = false;
          //     this.notif.showNotification('mat-success','La validation de la commande a été terminée avec succès','top','right');
          //     let currentorder = await this.ordersService.GetOrderByIdV1(order.id).toPromise();
          //     this.preview(currentorder);
          //     this.route.navigate(["/sales/sales-person-orders"]);

          //   } else {
          //     let resultError = this.parseErrorHelper.parse(<Result>result);
          //     this.notif.showNotification('mat-warn','La validation de la commande a échouée ' + resultError,'top','right');

          //   }

          // }, (error) => {
          //     this.notif.showNotification('mat-warn',error,'top','right');
          // });
        }
        this.savingProcess = false;

      }
    } else {
      this.notif.showNotification('mat-success','Veuillez renseigner tous les champs du formulaire','top','right');
    }

  }
  preview(order) {
    this.dialogOpend = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      order: order,
    };
    dialogConfig.disableClose = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';
    var modalRef = this.dialog.open(OrderDetailComponent, dialogConfig);
    modalRef.afterClosed().subscribe(res => {
      this.dialogOpend = false;
    });
  }
  async cancelOrder() {
    let order ;
    order = this.form.value;
    order.orderItems = this.rows;
    await this.deletePendingOrder(order);
    this.route.navigate(["/sales/sales-person-orders"]);
  }
  async close() {
    this.cancelOrder();
    this.route.navigate(["/sales/sales-person-orders"]);

  }


  selectPendingOrder(selectedOrder) {
    this.createdBy = selectedOrder.createdBy;
    this.updatedBy = selectedOrder.updatedBy;
    if(this.selectedTab != 0) this.selectedTab = 0;
    this.setFromPendingOrder(selectedOrder);
    this.rows= [...this.rows];
    this.updateListOrder();
    this.getGlobalBenefit();

  }
  async deletePendingOrder(selectedOrder) {
    let response = await this.dialogHelper.confirmDialog(this.dialog,'Êtes Vous sûr de bien vouloir supprimer la commande en attente');
    if(response) {
      for (const element of selectedOrder.orderItems) {
        element.quantity = -1 * eval(element.quantity.toString());
        element.orderId = selectedOrder.id;
        element.supplierOrganizationId = selectedOrder.supplierId;
        element.customerId = selectedOrder.customerId;
        await this.ordersService.updateItemV2(selectedOrder.id, element).toPromise();

      }
      this.ordersService.cancelPendingOrder(selectedOrder).subscribe(res => {
        this.notif.showNotification('mat-success','La commande a été annulée avec succès','top','right');
        let orders = this.cachedOrders.filter(order => order.id != selectedOrder.id);
        this.cachedOrders = orders;
        this.items = [];
        this.pendingGrid.refresh();
        this.rows = [];
        this.form.reset();

      }, (error) => {
        this.notif.showNotification('mat-success',error,'top','right');
      });
    }

  }

  onTabChanged($event) {
    let clickedIndex = $event.index;
    if(this.selectedTab != clickedIndex) this.selectedTab = clickedIndex;
    if(clickedIndex == 0) {
      let rows = this.rows;
      this.rows = [...rows];
    }
    else if(clickedIndex == 2) {
      this.fetchInvoices();
    }
    else if(clickedIndex ==3 ) {
      this.fetchProducts();
    }
    else if(clickedIndex == 4 ) {
      console.count('tab clicked');
      
      this.fetchCustomerDebts();
    }
  }

  // Function to diasplay number of UG (Unité gratuite ) by Product
  getUG(row) {
    let quantity = 0;
    let rows = this.rows.filter(ele => ele.productId == row.productId);

    rows.forEach(element => {
      quantity+=eval(element.quantity.toString());
    });
    let discount =  this.discounts.find(disc => disc.productId == row.productId && quantity >= disc.thresholdQuantity);

    if(discount != null )
    return this.calculHelper.calculUg(quantity, discount.discountRate).toFixed(1);
    else return 0;
  }
  
  fetchInvoices() {
    this.eventsSubject.next();
  }
  fetchProducts() {
    this.eventsSubjectByProducts.next();
  }
  fetchCustomerDebts() {
    this.eventsSubjectByDebt.next();
  }
}



