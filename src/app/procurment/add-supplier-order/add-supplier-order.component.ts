import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { CommandClickEventArgs, CommandModel, EditSettingsModel, GridComponent, GridModel, IEditCell, KeyboardEventArgs } from '@syncfusion/ej2-angular-grids';
import { loadCldr, setCulture } from '@syncfusion/ej2-base';
import { InventSum } from 'src/app/inventory/inventsum/models/inventsum-model';
import { AuthService } from 'src/app/services/auth.service';
import { SupplierOrderService } from 'src/app/services/supplier-order.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { Customer } from 'src/app/tiers/customer/models/customer-model';
import { Supplier } from 'src/app/tiers/supplier/models/supplier-model';
import { CreateSupplierOrderItem, SupplierOrderItem } from '../models/SupplierOrderItem';
import * as uuid from 'uuid';
import { AddProductSupplierOrderComponent } from '../add-product-supplier-order/add-product-supplier-order.component';
import { SupplierOrder } from '../models/SupplierOrder';
import { DetailSupplierOrderComponent } from '../detail-supplier-order/detail-supplier-order.component';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { AvailableProductsComponent } from 'src/app/sales/available-products/available-products.component';
import { SupplierListComponent } from '../supplier-list/supplier-list.component';
import { DialogHelper } from 'src/app/shared/DialogHelper';

@Component({
  selector: 'app-add-supplier-order',
  templateUrl: './add-supplier-order.component.html',
  styleUrls: ['./add-supplier-order.component.sass']
})
export class AddSupplierOrderComponent implements OnInit {

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
  navigation: any;
  supplierId: any;
  supplier: any;
  isPsy: boolean;
  dialogOpend: boolean = false;
  currentSupplier: any;

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
    switch (event.key) {
      case "+":
        if(this.selectedTab == 1) {
          event.preventDefault();
          let index = this.pendingGrid.selectedRowIndex;
          this.selectPendingOrder(this.cachedOrders[index]);
        }
        event.preventDefault();
        if(this.form.value.supplierId == null) {
          this.notif.showNotification('mat-danger','Merci de  selectionner votre fournisseur','top','right');
        } else {
          this.addProductLine();
        }
        break;
      case "-":
        event.preventDefault();
        let orderItem = this.rows[this.grid.selectedRowIndex];
        this.deleteSupplierOrderItem(orderItem);
        break;
      case "F2":
        event.preventDefault();
        this.save(false);
        break;
      case "F3":
        event.preventDefault();
        this.addProductLine();
        break;

      case "F4":
        event.preventDefault();
        this.detailSupplier();
        break;
      case "F6":
        event.preventDefault();
        this.save(true);
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
     
      case "F8":
        event.preventDefault();
        let order = new SupplierOrder();
        order.supplierId = this.form.value.supplierId;
        order.customerId = this.form.value.customerId;
        order.expectedDeliveryDate = this.form.value.expectedDeliveryDate;
        order.id = this.form.value.id;
        order.orderItems = this.rows;
        this.preview(order);
        break;
      // case "Enter":

      //   if(this.selectedTab == 0 && this.selectedSupplier != undefined) {
      //     event.preventDefault();
      //     this.dialog.closeAll();
      //     if(this.currentSupplier) this.onSupplierSelection(this.currentSupplier);
      //   }
      //   break;
    
      case "Delete" :{
        event.preventDefault();
        if(!this.dialogOpend) {
          let index = this.pendingGrid.selectedRowIndex;
          this.deletePendingOrder(this.cachedOrders[index]);
        }
      }
      default:
        break;
    }
  }
  @HostListener('window:load', ['$event']) 
  onLoad(event: Event) {
    this.route.navigate(['/procurment/supplier-orders-list']);    
  } 

  public form: FormGroup;  
  suppliers: Supplier[] = [];
  rows: SupplierOrderItem[] = [];
  public formControl = new FormControl();
  public value: string;role: any;
  // products: Product[] = [];
  // cachedProduct: Product[] = [];
  customers: Customer[] = [];
  invent: InventSum[] = [];
  selected = [];
  selectedSupplier: any;
  searchActive : boolean = false;
  quotasByCustomer : any[] = [] ;
  cachedOrders: SupplierOrder[];
  @ViewChild('select') myElement: ElementRef;
  @ViewChildren('ngSelect') ngSelect:ElementRef;
  @ViewChild(MatSelect) orderType: MatSelect;
  @ViewChildren('ngProduct') ngProduct: QueryList<ElementRef>;
  @ViewChildren('ngInvent') ngInvent: QueryList<ElementRef>
  @ViewChild('headerElement', { read: ElementRef }) headerElement:ElementRef;
  @ViewChildren('ngdt') ngdt:ElementRef;
  @ViewChild('btnRef') buttonRef: MatButton;
  @ViewChild('batchgrid') public grid: GridComponent;n
  @ViewChild('pendingGrid') public pendingGrid: GridComponent;
  public extraDiscountRules: object;
  public quantityRules: object;

  public readonly submittedValue: EventEmitter<void>;
  @ViewChild('refDocument') refDocumentRef: ElementRef;

  public childGrid: GridModel = {

    queryString: 'orderNumber',
    columns: [
        { field: 'productName', headerText: 'Order ID', textAlign: 'Right', width: 120 },
        { field: 'internalBatchNumber', headerText: 'Customer ID', width: 150 },
        { field: 'quantity', headerText: 'Ship City', width: 150 },
        { field: 'expiryDate', headerText: 'Ship Name', width: 150 }
    ],
  };

  constructor( 
    private fb: FormBuilder,
    private notif: NotificationHelper,
    private route: Router,
    private supplierOrderService: SupplierOrderService,
    private _auth: AuthService,
    private dialogHelper: DialogHelper,
    private dialog: MatDialog, private el: ElementRef) {

      this.navigation = route.getCurrentNavigation();
      setCulture('fr');
      loadCldr(require('./../../sales/numbers.json'));

    }


  async ngOnInit() {

    this.gridLines = 'Both';
    this.selectedTab = 0;
    this.filterSettings = { type: 'Menu' };
    this.toolbarItems = [
      { text: 'Ajouter Article (F3 / +)', tooltipText: 'Ajouter un Article', id: 'addarticle' },
      { text: 'Supprimer Article (-)', tooltipText: 'Sauvgarder la commande', id: 'deletearticle' },
      { text: 'Filtrer (F9)', tooltipText: 'Sauvgarder la commande',  id: 'filter' },
      { text: 'Sauvgarder (F2)', tooltipText: 'Sauvgarder la commande', id: 'saveorder' },
      { text: 'Sauvgarder et Valider (F6)', tooltipText: 'Sauvgarder et valider la commande', id: 'savevalidorder' },
      { text: 'Annuler (F5)', tooltipText: 'Annuler',  id: 'cancelorder' },
      { text: 'Visualiser (F8)', tooltipText: 'Visualiser', id: 'viewlines' , cssClass:'e-info'},

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
    
    this.supplierId = this.navigation.extras.state.supplier.id;
    this.supplier = this.navigation.extras.state.supplier;
    this.selectedSupplier = this.supplier.id;

    this.suppliers.push(this.supplier);
    this.onSupplierSelection( this.selectedSupplier);
   // this.cachedProduct = JSON.parse(localStorage.getItem('products'));
    // this.cachedProduct = <any>(await this.dbService.getAll("products")).shift();
    this.onCommandTypeSelection(0);
    await this.createForm();
    //this.refDocumentRef.nativeElement.focus();
    this.form.patchValue({organizationId : this.supplier.organizationId });
    
    if(this.navigation.extras.state.order != null) {
      this.setFromPendingOrder(this.navigation.extras.state.order);
    }
  }
  public dataBound(e) {
    //this.grid.autoFitColumns();
    this.grid.selectRow(0);
  }
  async onCommandTypeSelection(commandType) {
    let products  = [];
    this.isPsy = commandType == 1;
    // if(commandType == 0) products  = this.cachedProduct.filter(product => !product.psychotropic );
    // else products  = this.cachedProduct.filter(product => product.psychotropic );

    // this.products = products;
    if(this.form && this.form.value && this.form.value.supplierId != null) {
     
    }
    this.cachedOrders = <SupplierOrder []> await this.supplierOrderService.getPendingSuppliersOrders(this.supplier.organizationId).toPromise();

  }
  onTabChanged($event) {
    let clickedIndex = $event.index;

    if(this.selectedTab != clickedIndex) this.selectedTab = clickedIndex;
    if(clickedIndex == 0) {
      let rows = this.rows;
      this.rows = [...rows];
    }
  }
  createForm() {
    this.form = this.fb.group({
      customerId: [this._auth.profile.organizationId, [Validators.required]],
      organizationId: [null, [Validators.required]],
      id: [uuid.v4(), []],
      orderType: [0, [Validators.required]],
      orderDate: [new Date(), [Validators.required]],
      supplierId: [this.supplierId, [Validators.required]],
      supplierName: [this.supplier.name, [Validators.required]],
      expectedDeliveryDate: [new Date(), [Validators.required]],
      refDocument : ['', []],
      psychotropic : [false, [Validators.required]]
    });
  }

  async onSupplierSelection(event) {
    this.currentSupplier = event;

    
  }
  supplierSearchFn  (term: string, item: any) {
    
    if(term!=undefined) {
      term = term.toLocaleLowerCase();
      return (item.code != undefined && item.code.toLocaleLowerCase().indexOf(term) > -1)   ||  item.name.toLocaleLowerCase().indexOf(term) > -1;
    }

  }
  keyDownHandler(e: KeyboardEventArgs) { 
    if (e.key === 'F2') {
          e.preventDefault();
          this.grid.endEdit();
          e.cancel = true;
    }
  }

  created(){
    //this.addProductLine();
  } 
  load(args){
    document.getElementsByClassName('e-grid')[0].addEventListener('keydown', this.keyDownHandler.bind(this));
    this.grid.element.addEventListener('keypress', (e: KeyboardEventArgs) => {
      if(e.key == '*') {
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
        };
      }
    });
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
  clickHandler(args: ClickEventArgs): void {
    switch (args.item.id) {
      case 'addarticle':
        this.addProductLine();
        break;
      case 'cancelorder':
        this.cancelOrder();
        break;
      case 'deletearticle':
        let orderItem = this.rows[this.grid.selectedRowIndex];
        this.deleteSupplierOrderItem(orderItem);
        break;
      case 'filter':
        this.filter();
        break;
      case 'saveorder':
        this.save(false);
        break;
      case 'savevalidorder':
        this.save(true);
        
        break;
      case 'viewlines':
        let order = new SupplierOrder();
        order.supplierId = this.form.value.supplierId;
        order.customerId = this.form.value.customerId;
        order.expectedDeliveryDate = this.form.value.expectedDeliveryDate;
        order.id = this.form.value.id;
        order.orderItems = this.rows;
        this.preview(order);
        break;
      default:
        break;
    }

  }

  filter() {
    var ele = document
    .getElementsByClassName("e-filtertext")
    .namedItem("productCode_filterBarcell");
    setTimeout(() => (ele as HTMLElement).focus(), 0);
  }
  addProductLine() {
    if(this.form.valid) {
      const dialogConfig = new MatDialogConfig();
      this.form.value.orderType =  this.isPsy? 1 : 0;
  
      dialogConfig.data = { 
        form: this.form.value, 
        rows: this.rows,
        currentSupplier : this.supplier,
  
      };
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '75%';
      dialogConfig.minHeight = "450px"
      if(!this.dialogOpend)  {
        var modalRef = this.dialog.open(AddProductSupplierOrderComponent, dialogConfig);
        this.dialogOpend = true;
      modalRef.afterClosed().subscribe(res => {
        this.dialogOpend = false;
        this.grid.selectRow(0);
        if(res != null) {
          if(this.rows.length == 0) {
            this.form.get('orderType').setValue((res.orderType ) ? 1 : 0);
            this.isPsy = (this.form.value.orderType == 1) ? true : false;
          }
          let productAlreadyExist = this.rows.find(ele => ele.productId == res.productId);
          if(productAlreadyExist == null)  {
            let supplierOrderItem = new SupplierOrderItem();
            supplierOrderItem.id = uuid.v4();
            supplierOrderItem.productId = res.productId;
            supplierOrderItem.productName = res.productName;
            supplierOrderItem.productCode = res.productCode;
            supplierOrderItem.quantity = res.quantity;
            supplierOrderItem.unitPrice = res.unitPrice;
            supplierOrderItem.expiryDate = res.expiryDate;
            supplierOrderItem.minExpiryDate = res.minExpiryDate;
            supplierOrderItem.discount = res.discount;
            this.rows = [...this.rows,supplierOrderItem];
            this.selected = [];
            this.selected = [...this.selected,supplierOrderItem];
            this.addProductLine();
          } else {
            this.rows.map(ele => {
              if(ele.productId == res.productId) {
                ele.quantity+= res.quantity;
                ele.discount = res.discount;
                this.onQuantityChange(ele, ele.quantity);
              } 
            });
            this.grid.refresh();
          }
          
        }
      })
      }
    } else {
      this.notif.showNotification('mat-success','Veuillez renseigner les  champs obligatoires','top','right');
      this.form.markAllAsTouched();
    }
  }
  async deleteSupplierOrderItem(orderItem) {
    let response = await this.dialogHelper.confirmDialog(this.dialog,'Êtes Vous sûr de bien vouloir supprimer le produit');
    if(response) {
      await this.supplierOrderService.deleteOrderItem(this.form.value.id, orderItem.productId).subscribe(result => {
        this.notif.showNotification('mat-success','Produit supprimé avec succès','top','right');
        let rows= this.rows.filter(item => item.productId != orderItem.productId );
        this.rows = rows;
      }, (error) => {
          this.notif.showNotification('mat-warn',error,'top','right');
      });
    } else return null;
  }
  
  getIndexRow(index) {
    return parseInt(index) + 1 ;
  }
  async save(withValidation) {
    // save entete ordeer
    if(this.form.invalid) return ;
    let itemOrder = this.rows[0];
    if(itemOrder != null) {
      let item = new CreateSupplierOrderItem();
      item.documentRef = this.form.value.refDocument;
      item.supplierName = this.form.value.supplierName;
      item.documentRef = this.form.value.refDocument;
      item.expectedDeliveryDate = this.form.value.expectedDeliveryDate;
      item.productCode = itemOrder.productCode;
      item.productId = itemOrder.productId;
      item.productName = itemOrder.productName;
      item.orderId = this.form.value.id;
      item.orderDate = this.form.value.orderDate;
      item.minExpiryDate = itemOrder.minExpiryDate;
      item.quantity = itemOrder.quantity;
      item.unitPrice = itemOrder.unitPrice;
      item.discount = itemOrder.discount;
      this.supplierOrderService.updateOrder(this.form.value.id,item).subscribe(result => {
        this.supplierOrderService.SaveOrder(this.form.value.id).subscribe(async result => {
          this.notif.showNotification('mat-success','La commande a été sauvegardé avec succès','top','right');
          if(withValidation) this.validate({id: this.form.value.id});
          else this.route.navigate(['/procurment/supplier-orders-list/']);
        }, (error) => {
          this.notif.showNotification('mat-warn',error,'top','right');
        });
      }, (error) => {
        let rows = this.rows.map(ele => {
          if(ele.id == item.id) return <SupplierOrderItem><unknown>item ;
          else return ele;
        });
        this.rows = rows;
          this.notif.showNotification('mat-warn',error,'top','right');
      });
    }
    //
  }
  async validate(order) {
    let response = await this.dialogHelper.confirmDialog(this.dialog,'Êtes Vous sûr de bien vouloir valider la commande');
    if(response) {
        this.supplierOrderService.validateOrder(order.id).subscribe(async result => {
        this.notif.showNotification('mat-success','Commande Fournisseur validée avec succès','top','right');
        this.route.navigate(['/procurment/supplier-orders-list/']);
      }, (error) => {
          this.notif.showNotification('mat-warn',error,'top','right');
      });
    } else return null;
  }
  preview(order) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { 
      order: order, 
    
    };
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '75%';
    dialogConfig.minHeight = "450px"
      var modalRef = this.dialog.open(DetailSupplierOrderComponent, dialogConfig);
      modalRef.afterClosed().subscribe(res => {
        this.route.navigate(["/procurment/supplier-orders-list"]);

      });
  }
  async cancelOrder() {
    let order ;
    order = this.form.value;
    order.orderItems = this.rows;
    await this.deletePendingOrder(order);
  }
  async close() {
    this.cancelOrder();
    this.route.navigate(["/sales/sales-person-orders"]);

  }
  async deletePendingOrder(selectedOrder) {
    let response = await this.dialogHelper.confirmDialog(this.dialog,'Êtes Vous sûr de bien vouloir supprimer la commande');
    if(response) {
        this.supplierOrderService.deletePendingOrder(selectedOrder.id).subscribe(async result => {
        this.notif.showNotification('mat-success','Commande Fournisseur supprimé avec succès','top','right');
        this.cachedOrders = <SupplierOrder []> await this.supplierOrderService.getPendingSuppliersOrders(this.supplier.organizationId).toPromise();
        this.rows = [];
        this.form.reset();
        this.route.navigate(["/sales/sales-person-orders"]);

      }, (error) => {
          this.notif.showNotification('mat-warn',error,'top','right');
      });
    } else return null;
   
  }
  actionComplete(args) {
    let  oldQuantity ;
    let oldExtraDiscount;
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
        const Quantity = 'quantity';
        oldExtraDiscount = args.rowData['discount'];
        oldQuantity = args.rowData[Quantity];
    }
    if ((args.requestType === 'save')) {
      this.onQuantityChange(args.rowData, args.data.quantity);
      if(args.rowData.discount != args.data.discount)
      this.onDiscountChange(args.rowData, args.data.discount);
      if(args.rowData.minExpiryDate != args.data.minExpiryDate)
      this.onMinExpiryDateChange(args.rowData, args.data.minExpiryDate);
      this.grid.refresh();

    }

  }
  createSupplierOrderItem(rowData) {
    let orderItemCommand = new CreateSupplierOrderItem();
    orderItemCommand.orderId = this.form.value.id;
    orderItemCommand.supplierOrganizationId = this.form.value.supplierId;
    orderItemCommand.productId = rowData.productId;
    orderItemCommand.productName = rowData.productName;
    orderItemCommand.supplierName = '';
    orderItemCommand.productCode = rowData.productCode;
    orderItemCommand.unitPrice = rowData.unitPrice;
    orderItemCommand.documentRef = this.form.value.refDocument;
    orderItemCommand.quantity = rowData.quantity;
    orderItemCommand.minExpiryDate = rowData.minExpiryDate;
    return orderItemCommand;
  }
  onMinExpiryDateChange(rowData: any, minExpiryDate: any) {
    let orderItemCommand = this.createSupplierOrderItem(rowData);
    orderItemCommand.minExpiryDate = minExpiryDate;
    this.updateOrder(this.form.value.id,orderItemCommand);

  }
  onDiscountChange(rowData: any, discount: any) {
    let orderItemCommand = this.createSupplierOrderItem(rowData);
    orderItemCommand.discount = discount;
    this.updateOrder(this.form.value.id,orderItemCommand);
  }
  commandClick(args: CommandClickEventArgs): void {
    this.deleteSupplierOrderItem(args.rowData)
  }

  async onQuantityChange(element,quantity) {
    if(quantity > 0 && element.quantity != quantity) {
       element.quantity = parseInt(quantity) ;
     
       element.customerId = this.form.value.customerId;
       let orderItemCommand = new CreateSupplierOrderItem();
       orderItemCommand.orderId = this.form.value.id;
       orderItemCommand.supplierOrganizationId = this.form.value.supplierId;
       orderItemCommand.productId = element.productId;
       orderItemCommand.productName = element.productName;
       orderItemCommand.supplierName = '';
       orderItemCommand.productCode = element.productCode;
       orderItemCommand.documentRef = this.form.value.refDocument;
       orderItemCommand.quantity = element.quantity;
       orderItemCommand.minExpiryDate = element.minExpiryDate;
       this.updateItem(orderItemCommand);
    }
  }
  updateItem(orderItemCommand) {
    let quantity = 0;
    this.rows.forEach(p => {
      if(p.productId == orderItemCommand.productId ) {
        quantity += p.quantity;
      }
    });
    orderItemCommand.quantity = quantity;
    this.updateOrder(this.form.value.id,orderItemCommand);
    
  }
  updateOrder(orderId, orderItemCommand) {
    this.supplierOrderService.updateOrder(orderId,orderItemCommand).subscribe(result => {
      this.notif.showNotification('mat-success','Quantité mise à jour avec succès','top','right');
    }, (error) => {
      let rows = this.rows.map(ele => {
        if(ele.id == orderItemCommand.id) return orderItemCommand 
        else return ele;
      });
      this.rows = rows;
        this.notif.showNotification('mat-warn',error,'top','right');
    });
  }
  async setFromPendingOrder(cachedOrder ) {
    if(cachedOrder != null) {
      this.form.setValue({
        supplierId : this.supplier.id,
        supplierName : this.supplier.name,
        orderDate : cachedOrder.orderDate,
        orderType : (cachedOrder.psychotropic) ? 1 : 0,
        expectedDeliveryDate : cachedOrder.expectedShippingDate ? cachedOrder.expectedShippingDate : new Date(),
        customerId : cachedOrder.customerId,
        organizationId : this.supplier.organizationId,
        id: cachedOrder.id, 
        refDocument : cachedOrder.refDocument ? cachedOrder.refDocument : "" ,
        psychotropic : cachedOrder.psychotropic
      });
      this.form.updateValueAndValidity();
      let rows = cachedOrder.orderItems;
     
      this.rows = rows;
      this.grid.selectRow(0);
      this.onCommandTypeSelection(this.form.value.orderType);
    }
  }
  dataBoundPending(e) {
    this.pendingGrid.selectRow(0);
    document.getElementsByClassName('e-grid')[0].addEventListener('keydown', this.keyDownHandler.bind(this));

  }
  pendingCommandClick(args: CommandClickEventArgs): void {
    if(args.commandColumn.title == 'supprimer') this.deletePendingOrder(args.rowData);
    if(args.commandColumn.title == 'selectionner') this.selectPendingOrder(args.rowData);
  }
  selectPendingOrder(selectedOrder) {
    if(this.selectedTab != 0) this.selectedTab = 0;
    this.setFromPendingOrder(selectedOrder);
    this.rows= [...this.rows];
  }
  availableProducts () {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    var ref=  this.dialog.open(AvailableProductsComponent);
  }
  detailSupplier () {  
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    var ref=  this.dialog.open(SupplierListComponent);
    const sub = ref.componentInstance.onAdd.subscribe(res => {
 
     if(res)
      this.selectedSupplier = res.id;
      this.supplierId = res.id;
      this.rows = [];
      this.suppliers = [];
      this.suppliers.push(res);
      this.currentSupplier = res;
    });
    ref.afterClosed().subscribe(res => {
    })
 }
}
