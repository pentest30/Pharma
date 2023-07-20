import { Component, ElementRef, EventEmitter, HostListener, Inject, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Discount } from 'src/app/discounts/discount-models/Discount';
import { InventSum } from 'src/app/inventory/inventsum/models/inventsum-model';
import { Product } from 'src/app/product/prodcut-models/product';
import { AuthService } from 'src/app/services/auth.service';
import { DiscountService } from 'src/app/services/discount.service';
import { InventSumService } from 'src/app/services/inventory.service';
import { OrdersService } from 'src/app/services/orders.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { OrderItem, OrderItemCreateCommand } from '../sales-models/orderItem';
import * as uuid from 'uuid';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Column, EditSettingsModel, GridComponent, parentsUntil, SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { QuotaService } from 'src/app/services/quota.service';
import { PickingZoneService } from 'src/app/services/piking-zone.service';
import { CalculMethodHelper } from 'src/app/shared/CalculMethodHelper';
import { ProductService } from 'src/app/services/product.service';
import { DateHelper } from 'src/app/shared/date-helper';
import * as Enumerable from "linq-es2015"; 
import { ErrorParseHelper, Result } from 'src/app/shared/helpers/ErrorParseHelper';
import { concat, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap, map, filter,startWith } from 'rxjs/operators';
import { NgbdSortableHeader, SortColumn, SortDirection, SortEvent } from '../add-order/NgbdSortableHeader';
const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;




@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.scss'],

})
export class SearchProductComponent implements OnInit {

  form: any = null;
  scrolledProduct: Product;
  @ViewChild("grid") public grid: GridComponent;
  @ViewChildren('ngSelect') ngSelect:ElementRef;
  rows: OrderItem[] = [];
  equivalenceOn: boolean;
  equivalenceProduct: Product;
  discounts: Discount[] = [];
  invent: InventSum[] = [];
  productId: any;
  public formGroup: FormGroup;
  @ViewChild('grid2') public grid2: GridComponent;
  @ViewChild('grid3') public grid3: GridComponent;

  editSettings: { allowEditing: boolean; allowAdding: boolean; allowDeleting: boolean; mode: 'Batch'};
  gridLines: string;
  public selectionOptions: SelectionSettingsModel;
  @Output() onAdd = new EventEmitter();

  public toolbarItems: object[];
  public editOptions: EditSettingsModel;
  public filterSettings: Object;


  @ViewChild("productId") productRef: NgSelectComponent;
  @ViewChild('productId') myElement: ElementRef;
  @ViewChild('internalBatch') internalBatchRef: NgSelectComponent;
  @ViewChild("quantity") quantityRef: ElementRef;

  equivalences = [];
  selected = [];
  displayedColumns: string[] = [ 'clientCode','clientName','orderNumber','shippingDate','commandStatus','productCode','productName','quantity'];
  isLoadingHistory : boolean = false;
  columns = [{ name: 'code' }, { name: 'fullName' },{name:'innCodeName'}, { name: 'manufacturer' }, { name: 'available' }, { name: 'taxGroup' }];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  selectedTab: number = 0;
  productHistoryOrders: any[] = [];
  availableQuantity: any;
  availableQuota: number;
  isSelected: any;
  cachedProduct: any;
  canDoOrder: boolean = true;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  selectedProduct: any;
  quotasByCustomer: any;
  extraDiscountActivated: boolean = false;
  isSavingItem: boolean;
  searchActive: any = false;
  discountsEquivalences: Discount[] = [];
  zones : any[] = [];
  isPsy : boolean = false;
  refDoc : string;
  customerId : string;
  products$: Observable<any>;
  productsLoading = false;
  productsInput$ = new Subject<string>();
  selectedMovie: any;
  minLengthTerm = 3;
  pageSettings: { pageSizes: boolean; pageSize: number; };
  @HostListener('document:load', ['$event'])
  
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        this.close();
        break;
      case "F11":
        event.preventDefault();
        this.selectedTab = 2;
        this.isLoadingHistory = true;
        this.getHistory();
        this.isLoadingHistory = false;
        break;
      case "F10":
        event.preventDefault();
        if(this.selectedTab == 0) this.selectedTab = 1;else this.selectedTab = 0;
        if(this.scrolledProduct && this.scrolledProduct.id) {
          if(this.equivalenceOn) this.resetProductList();
          else {
            this.getEquivalence({productId : this.scrolledProduct.id});
          }
        }
        break;
      default:
        break;
    }
  }
  async getHistory() {
    this.productHistoryOrders =  <any> await this.ordersService.getProductHistoryOrders(this.form.organizationId, this.selectedProduct.code).toPromise();
  }

  @HostListener('resize', ['$event'])
  onResize(event) {
    var offsetHeight = event.target.innerHeight - 300 ;
    setTimeout(()=> {
      this.grid2.height = offsetHeight + "px";
      this.grid3.height = offsetHeight + "px";

    }, 0);
  
  }
  constructor(private fb: FormBuilder,
    private notif: NotificationHelper,
    private ordersService: OrdersService,
    private productService: ProductService,
    private inventoryService: InventSumService,
    private discountService: DiscountService,
    private _auth: AuthService,
    private calculHelper: CalculMethodHelper,
    private dateHelper: DateHelper,
    private parseErrorHelper: ErrorParseHelper,
    private dialogRef: MatDialogRef<SearchProductComponent>,

     @Inject(MAT_DIALOG_DATA) private data,
      private quotaService : QuotaService) {
      this.form = this.data.form;
      this.isPsy = this.data.form.orderType == 1;
      this.refDoc =  this.data.form.refDocument;
      this.customerId = this.data.currentClient.organizationId;
      this.rows = this.data.rows;

  }
  async ngOnInit() {
    await this.createFrom();

    this.loadProducts();
    this.gridLines = 'Both';
    this.zones = this.data.zones;
    this.quotasByCustomer =[];
    
    this.formGroup.get("productId").valueChanges
    .subscribe(() => {
      this.internalBatchRef.searchInput.nativeElement;
      this.productRef.focus();
      if(this.formGroup.value.productId != null) {
        this.internalBatchRef.focus();
        this.internalBatchRef.open();
      }
    });
    this.formGroup.get("internalBatchNumber").valueChanges
    .subscribe(() => this.quantityRef.nativeElement.focus());
    this.pageSettings = { pageSizes: true, pageSize: 12 };

  }

  ngAfterContentInit() {
    setTimeout(() => {
      if(this.productRef) this.productRef.focus();
    },400);
  }
  private async createFrom() {
    this.formGroup = await this.fb.group({
      orderType: [this.isPsy,[]],
      quantity: [null, [Validators.min(1),Validators.required,this.quantityRangeValidator()]],
      productId: [null, [Validators.required]],
      productName: [null, [Validators.required]],
      defaultLocation: [null, []],
      internalBatchNumber: [null, [Validators.required]],
      productCode: [null, []],
      packing: [null, []],
      pickingZoneId: [null, []],
      thermolabile: [null, []],
      unitPrice: [0, [Validators.required, this.UnitPriceValidator.bind(this)]],
      discount: [0, []],
      extraDiscount: [0, [this.extraDiscountValidator()]],
      expiryDate: [null, []],
      tax: [0, []],
      purchaseUnitPrice: [0, []],
      ppaPFS: [0, []],
      pfs: [0, []],
      availableQuota : [this.availableQuota]
      
    });
  }
  loadProducts() {
    this.products$ = concat(
      of([]), // default items
      this.productsInput$.pipe(
        filter(res => {
          this.productRef.clearItem(this.selectedProduct);
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(100),
        tap(() => this.productsLoading = true),
        switchMap(term => {

          return this.getProducts(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => this.productsLoading = false)
          )
        })
      )
    );

  }

  getProducts(term: string = null): Observable<any> {
    return this.productService
      .getAllByName( term, this.isPsy)
      .pipe(map(resp => {
        if (!resp) {
          throwError(resp);
        } else {
          return resp;
        }
      })
    );
  }
 
  onToggle(event) {
    this.extraDiscountActivated = event.checked;
  }
  onTabChanged($event) {
    let clickedIndex = $event.index;
    if(this.selectedTab != clickedIndex) this.selectedTab = clickedIndex;
    switch (clickedIndex) {
      case 1:
        this.getEquivalence(this.scrolledProduct);
        break;
      default:
        break;
    }
    if(clickedIndex == 0) {
      let rows = this.rows;
      this.rows = [...rows];
    }
  }
 
  UnitPriceValidator(control: AbstractControl): {[key: string]: any} | null  {
    if (control.value && (control.value < this.formGroup.value.purchaseUnitPrice || control.value == 0) ) {
      return { 'invalidUnitPrice': true };
    }
    return null;
  }

  extraDiscountValidator():  ValidatorFn { 
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if(control.value < 0 || control.value > 100) return { 'extraDiscountValue': true };
      return null;
    }
  }
  Doubleclick(e){ 
    this.onProductSelection(e.rowData);
    this.selectedTab = 0;
    return;
  } 
  quantityRangeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if ( control.value !== undefined && (isNaN(control.value)  || control.value < 0  ||  (this.selectedProduct && this.selectedProduct.hasQuota && !this.availableQuota) ||  (this.selectedProduct&& this.selectedProduct.hasQuota &&this.availableQuota &&control.value > this.availableQuota))) {
          return { 'quotaRange': true };
        }
        if (control.value !== undefined && (isNaN(control.value) || control.value < 0 || control.value > this.availableQuantity)) {
            return { 'quantityRange': true };
        }
        return null;
    };
  }
  async resetProductList() {
    this.equivalenceOn = false;
    this.equivalenceProduct = null;
  }
  async addOrderItem  (id,command): Promise<any> {
    var result = await this.ordersService.add(id,command ).toPromise();
    if(result != null) {
      let resultError = this.parseErrorHelper.parse(<Result>result);

      return result;
    } else {

    }
    
  }
  
  async save () {

    if(this.formGroup.invalid) return;
    else  if(this.formGroup.value.quantity <= 0) {
      this.notif.showNotification('mat-warn',"La quantité doit être superieure à 0",'top','right');
      return;
    } else if (this.formGroup.value.unitPrice == 0 || this.formGroup.value.unitPrice < 0){
      this.notif.showNotification('mat-warn',"Le prix de vente est invalid",'top','right');
      return;
    } else if (this.canDoOrder == false) {
      this.notif.showNotification('mat-warn',"Le client a atteint sa limite de crédit " + this.data.currentClient.limitCredit + "DA",'top','right');
      return;
    } else {
      if(!this.isSavingItem) {
        this.isSavingItem = true;
        let zone = (this.zones && this.zones.length > 0) ? this.zones.find(z => z.id == this.formGroup.value.pickingZoneId) : null;
        let command = new OrderItemCreateCommand();
        command.orderId = this.form.id;
        command.customerId = this.form.customerId;
        command.productId = this.formGroup.value.productId;
        command.productCode = this.formGroup.value.productCode;
        command.defaultLocation = this.formGroup.value.defaultLocation;
        command.id = uuid.v4();
        command.quantity = parseInt(this.formGroup.value.quantity);
        command.extraDiscount = this.formGroup.value.extraDiscount ;
        command.internalBatchNumber = this.formGroup.value.internalBatchNumber;
        command.supplierOrganizationId = this._auth.profile.organizationId;
        command.orderType = (this.formGroup.value.orderType) ? 1 : 0;
        command.documentRef = this.refDoc;
        command.packing = this.formGroup.value.packing;
        command.thermolabile = this.formGroup.value.thermolabile;
        command.toBeRespected = this.form.toBeRespected;
        command.specialOrder = this.form.isSpecialOrder;
        command.tax = this.formGroup.value.tax;
        if(zone) command.pickingZoneId = zone.id;
        command.pickingZoneName = (zone != null) ? zone.name: null;
        command.zoneGroupId = (zone != null) ? zone.zoneGroupId: null;
        command.zoneGroupName = (zone != null) ? zone.zoneGroup?.name: null;
        command.pickingZoneOrder = (zone != null) ? zone.order: 0;
        let row = this.rows.filter(ele => ele.productId == command.productId && ele.internalBatchNumber == command.internalBatchNumber);
        if(row && row.length == 0) {
          let result = await this.ordersService.add(this.form.id,command).toPromise();
          if(result == null) {
           this.notif.showNotification('mat-success','la ligne est réservé avec succès','top','right');
           this.isSavingItem = false;
           this.selectedProduct = null;
           this.dialogRef.close(this.formGroup.value);
          } else {
           let resultError = this.parseErrorHelper.parse(<Result>result);
           this.notif.showNotification('mat-success',resultError,'top','right');
          }
        } else  {
          await this.updateItem(command,null);
          this.selectedProduct = null;
          this.dialogRef.close(this.formGroup.value);
        }  
      } else {
        this.notif.showNotification('mat-success','La sauvegarde est en cours','top','right');
      }
    }
  }
  close (){
    this.dialogRef.close(null);
  }
  async onProductSelection(selectedProduct) {
    this.selectedProduct = selectedProduct;
    this.scrolledProduct = selectedProduct;
    this.equivalences = [];
    if(selectedProduct && selectedProduct.id) {
      this.discounts = await this.discountService.getActive(selectedProduct.id).toPromise();
      this.selectedProduct = selectedProduct;

      // Get Available Quantity Quota Case 
      
      if(selectedProduct.hasQuota) {
        this.quotasByCustomer = await this.quotaService.getQuotabyProductId(this.selectedProduct.id).toPromise();
        var item = (this.quotasByCustomer.length) ? this.quotasByCustomer.find(x=>x.productId == selectedProduct.id && selectedProduct.hasQuota) : null;
        if(item !=null) {
          this.availableQuota = item.availableQuantity;
        }
        else this.availableQuota = null;
      }
      else this.availableQuota = null;
      
      // End Quota Case
      // Get Equivalence for selected Product
      
      // if( selectedProduct.innCodeId ) {
      //   let products = this.products.filter(item => item.innCodeId != null && item.innCodeName != "" &&  item.innCodeId == selectedProduct.innCodeId &&  item.code != selectedProduct.code);
      //   this.equivalences = products;
      // }
      // else this.equivalences = [];
      // End Equivalence 
      this.formGroup.get('internalBatchNumber').setValue(null);
      this.productId = selectedProduct.id;
      this.formGroup.get("productName").setValue(selectedProduct.fullName);
      this.formGroup.get("productId").setValue(selectedProduct.id);
      this.formGroup.get("productCode").setValue(selectedProduct.code);
      this.formGroup.get("defaultLocation").setValue(selectedProduct.defaultLocation);
      this.formGroup.get('tax').setValue(selectedProduct.tax);
      if (selectedProduct.pickingZoneId) this.formGroup.get('pickingZoneId').setValue(selectedProduct.pickingZoneId);
      this.formGroup.get("thermolabile").setValue(selectedProduct.thermolabile);
      this.formGroup.get('availableQuota').setValue(this.availableQuota);
      let result = await this.inventoryService.getStockForSalesPerson(this.form.supplierId, selectedProduct.id).toPromise();
      this.internalBatchRef.focus();
      this.internalBatchRef.open();

      if(result != null) {
        this.invent = result;
      } else {
        this.productRef.focus();
        this.internalBatchRef.close();
        this.invent = [];
        this.notif.showNotification('mat-success','Produit indisponible','top','right');
        return false;
      }
      this.isSelected = false;
      return false;

    }
  }
  onClearSelection(selectedProduct) {
    this.productRef.focus();
    this.internalBatchRef.close();
    this.invent = [];
  }
  async onBatchSelection(selectedBatch) {
      this.availableQuantity = selectedBatch.physicalAvailableQuantity;
      this.formGroup.get('expiryDate').setValue(selectedBatch.expiryDate);
      let purchaseDiscountedPrice =selectedBatch.purchaseUnitPrice;// (selectedBatch.purchaseDiscountRatio > 0) ? ((1 - selectedBatch.purchaseDiscountRatio) * selectedBatch.purchaseUnitPrice) : selectedBatch.purchaseUnitPrice;
      this.formGroup.get('purchaseUnitPrice').setValue(purchaseDiscountedPrice);
      this.formGroup.get('discount').setValue(selectedBatch.discount);
      this.formGroup.get('unitPrice').setValue(selectedBatch.salesUnitPrice);
      this.formGroup.get('extraDiscount').setValue(selectedBatch.extraDiscount);
      this.formGroup.get('pfs').setValue(selectedBatch.pfs);
      this.formGroup.get('ppaPFS').setValue(selectedBatch.ppaPFS);
      this.formGroup.get('packing').setValue(selectedBatch.packing);
      this.quantityRef.nativeElement.focus()
  }
  async onCommandTypeSelection(commandType) {
    this.isPsy = (commandType.checked) ? true : false; 
    this.loadProducts();
    this.formGroup.patchValue({
      productId:null,
      internalBatchNumber:null,
      quantity:null,
      extraDiscount:null,
      expiryDate:null,
      purchaseUnitPrice:null
    });
    this.productRef.focus();
  }

  async onSelecteEquivalence(selectedProduct) {
    this.products$.pipe(tap(p => {
      p.push(selectedProduct);
    }));
    this.discountsEquivalences = await this.discountService.getActive(selectedProduct.id).toPromise();
  }

  checkOverTakingCredit() {
    let currentAmountOrder = this.calculHelper.getTotalTTC(
      this.formGroup.value.unitPrice,
      this.formGroup.value.quantity, 
      this.formGroup.value.discount,
      this.formGroup.value.extraDiscount,
      this.formGroup.value.tax );
    let orderAmount =  this.calculHelper.getTotalTTCCart(this.rows) + currentAmountOrder;
    if(this.data.currentClient.limitCredit == 0) this.canDoOrder = true;
    else {
      let diff= this.data.currentClient.limitCredit - (this.data.currentClient.debt + orderAmount);
      if(diff < 0) this.canDoOrder =  false ; else this.canDoOrder=true;
    }
  }
  async updateItem(orderItemCommand,element) {
    let quantity = 0;
    this.rows.forEach(p => {
      if(p.productId == orderItemCommand.productId && p.internalBatchNumber == orderItemCommand.internalBatchNumber ) {
        let qte = parseInt(<any>p.quantity);
        quantity = quantity + qte;
      }
    });
    orderItemCommand.quantity = parseInt(orderItemCommand.quantity)  + quantity;
    let r = await this.ordersService.updateItemV2(this.form.id,orderItemCommand).toPromise();
    if(!r) {
      this.notif.showNotification('mat-success','Quantité mise à jour avec succès','top','right');
    }
    else {
      this.notif.showNotification('mat-warn',r,'top','right');
    }
  }
  public dataBoundEquivalence(e) {
    this.grid2.selectRow(0);
    this.grid2.height = window.innerHeight - 400;
    var ele = document
        .getElementsByClassName("e-filtertext")
        .namedItem("name_filterBarcell");
    if(ele) {
      if(!this.searchActive) {
        setTimeout(() => (ele as HTMLElement).focus(), 0);
        }
        else {
          setTimeout(() => (ele as HTMLElement).blur(), 0);
          this.grid2.selectRow(0);
        };
       this.searchActive =!this.searchActive;
    }
       
  }
  dataBoundHistory() {
    this.grid3.selectRow(0);
    this.grid3.height = window.innerHeight - 300;
  }
  keyPressed(e) {
    if (e.key === "Enter") {
       let product = this.equivalences[this.grid2.selectedRowIndex];
       this.onProductSelection(product);
       this.selectedTab = 0;
      return;
    }
    var currentEle = parentsUntil(e.target, "e-filtertext"); 

    if(currentEle && currentEle.getAttribute("id") ){ 
      let currIndex = this.grid2.columns.findIndex(c => c.field == currentEle.getAttribute("id").replace("_filterBarcell","") );
      if(e.key =="ArrowDown") {
        let id = this.grid2.element.getElementsByClassName('e-filtertext e-input').item(currIndex).getAttribute("id");
        document.getElementById(id).blur();
        this.grid2.selectedRowIndex = 0;
      }
      if(e.key =="ArrowRight") {
        let nextElement = (<Column[]>this.grid2.columns).find(c => c.index == currIndex + 1);
        while (!nextElement.allowFiltering ) {
          currIndex+=1;
          nextElement = (<Column[]>this.grid2.columns).find(c => c.index == currIndex );
        }
        if(this.searchActive) {  
          var ele = document.getElementsByClassName("e-filtertext").namedItem(nextElement.field + "_filterBarcell");
          setTimeout(() => (ele as HTMLElement).focus(), 0);
        }
      }
      if(e.key =="ArrowLeft") {
        let previousElem = (<Column[]>this.grid2.columns).find(c => c.index == currIndex - 1);
        while (!previousElem.allowFiltering ) {
          currIndex-=1;
          previousElem = (<Column[]>this.grid2.columns).find(c => c.index == currIndex );
  
        }
        if(this.searchActive) {  
          var ele = document.getElementsByClassName("e-filtertext").namedItem(previousElem.field + "_filterBarcell");
          setTimeout(() => (ele as HTMLElement).focus(), 0);
        }
      }
    }
  }
  
  keyPressedHistoryList(e) {
    var currentEle = parentsUntil(e.target, "e-filtertext"); 

    if(currentEle && currentEle.getAttribute("id") ){ 
      let currIndex = this.grid3.columns.findIndex(c => c.field == currentEle.getAttribute("id").replace("_filterBarcell","") );
      if(e.key =="ArrowDown") {
        let id = this.grid3.element.getElementsByClassName('e-filtertext e-input').item(currIndex).getAttribute("id");
        document.getElementById(id).blur();
        this.grid3.selectedRowIndex = 0;
      }
      if(e.key =="ArrowRight") {
        let nextElement = (<Column[]>this.grid3.columns).find(c => c.index == currIndex + 1);
        while (!nextElement.allowFiltering ) {
          currIndex+=1;
          nextElement = (<Column[]>this.grid3.columns).find(c => c.index == currIndex );
        }
        if(this.searchActive) {  
          var ele = document.getElementsByClassName("e-filtertext").namedItem(nextElement.field + "_filterBarcell");
          setTimeout(() => (ele as HTMLElement).focus(), 0);
        }
      }
      if(e.key =="ArrowLeft") {
        let previousElem = (<Column[]>this.grid3.columns).find(c => c.index == currIndex - 1);
        while (!previousElem.allowFiltering ) {
          currIndex-=1;
          previousElem = (<Column[]>this.grid3.columns).find(c => c.index == currIndex );
  
        }
        if(this.searchActive) {  
          var ele = document.getElementsByClassName("e-filtertext").namedItem(previousElem.field + "_filterBarcell");
          setTimeout(() => (ele as HTMLElement).focus(), 0);
        }
      }
    }
  }
  
   async onKeyDown(event) {
   try {
    this.scrolledProduct = <Product>this.productRef.itemsList.markedItem.value; 
    this.discounts = await this.discountService.getActive(this.scrolledProduct.id).toPromise();

   } catch (error) {
   }
  }

  async getEquivalence(event) {
    this.equivalenceOn = true;
    if(event && event.productId /*&& this.products.length*/) {
      let products =<Product[]>  await this.getProducts(event.innCodeName).toPromise(); 
       var linq = Enumerable.From(products);
        var result = <Product[]> linq.OrderByDescending(x => x.quantity).ToArray();
        this.equivalences = result;
     // let product = this.products.find(ele => ele.id == event.productId);
      //this.equivalenceProduct = product;
      // if(product != null) {
      //  // let products = this.products.filter(item => item.innCodeName != "" && item.innCodeId != null && item.innCodeId == product.innCodeId && item.code != product.code );
      //  let products =<Product[]>  await this.getProducts(event.innCodeId).toPromise(); 
      //  var linq = Enumerable.From(products);
      //   var result = <Product[]> linq.OrderByDescending(x => x.quantity).ToArray();
      //   this.equivalences = result;
      // }
    }
  }
  getUg(quantity, discount) {
    let rateUg = this.calculHelper.calulTauxUg(discount) ;
    return this.calculHelper.calculUg(quantity,rateUg ).toFixed(1);
  }
  onSortBatch({column, direction}: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    if (direction === '') {
      this.invent = this.invent;
    } else {
      this.invent = [...this.invent].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
  getDifferenceDates(ddp) {
    let toDay = new Date();
    let ddpDate = new Date(ddp); 
    let time_difference = this.dateHelper.difference(toDay,ddpDate) / 30;
    if(time_difference > 6) return true ;else return false;
  }
}

