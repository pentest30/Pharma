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
import { SignalRService } from 'src/app/services/signal-r.service';
import { NotificationHelper } from 'src/app/shared/notif-helper'; 
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
import { Order } from 'src/app/sales/sales-models/Order';
import { PreparationOrderItem } from '../models/PreparationOrderItem';
import { PreparationOrdersService } from 'src/app/services/preparation-orders.service';
 



export type SortColumn = keyof any | '';
export type SortDirection = 'asc' | 'desc' | '';
export const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}


export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Component({
  selector: 'app-edit-preparation-item-form',
  templateUrl: './edit-preparation-item-form.component.html',
  styleUrls: ['./edit-preparation-item-form.component.sass']
})
export class EditPreparationItemFormComponent implements OnInit {


  form: any = null;
  scrolledProduct: Product;
  @ViewChild("grid") public grid: GridComponent;
  @ViewChildren('ngSelect') ngSelect:ElementRef; 
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
  _selectedBatch:any;
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
        break;
        
      default:
        break;
    }
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
    private zoneService: PickingZoneService,
    private inventoryService: InventSumService,
    private discountService: DiscountService,
    private _auth: AuthService,
    private orderService : OrdersService,
    private calculHelper: CalculMethodHelper,
    private dateHelper: DateHelper,
    private parseErrorHelper: ErrorParseHelper,
    private orderPreparationService: PreparationOrdersService,
    private dialogRef: MatDialogRef<EditPreparationItemFormComponent>,

     @Inject(MAT_DIALOG_DATA) private data,
      private quotaService : QuotaService) {
         

      
      
  } 
  order:any;
  blByOrder: any;
  internalBatchNumber:any;
  controlledOrderItem: PreparationOrderItem[] = [];
  groupBy(list) {
    var result = [];

    list.forEach(element => {
      let quantityControlled = 0;
      let controlledOrderItemByProduct = this.controlledOrderItem.filter
      (e => e.productId == element.productId && e.isControlled)
      controlledOrderItemByProduct.forEach(e => {
        if(e.status != 20 ) quantityControlled+=e.quantity;
      });
      // Add their sum of ages
      var listByProduct = list.filter( c => c.productId == element.productId);

      const sumOfQuantity = listByProduct.reduce((sum, currentValue) => {
        return sum + currentValue.quantity;
      }, 0);

      const minDiscount = listByProduct.reduce((min, currentValue) => {

        if(currentValue.discount < min) min = currentValue.discount;
        return min;
      }, 100);
      let find = result.find(c => c.productId == element.productId);
      let qty=sumOfQuantity - quantityControlled
      if(this.data.line.packing && this.data.line.packing!=0&&this.data.currentZone.zoneType != 10)
if(this.data.currentZone.zoneType!=30 )
qty%=this.data.line.packing
else
qty=qty - qty%this.data.line.packing
      if(find == null) {
        result.push({
          productId : element.productId,
          productName : element.productName,
          productCode : element.productCode,
          defaultLocation : element.defaultLocation,

          quantity : qty,
          initial: sumOfQuantity,
          controlled: quantityControlled,
          discount: minDiscount
        });
      }

    });
    console.log(result);
    return result;
  }
  customMaxValidation():ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null =>{
      if(control.value==0) return null;
    if (!control.value|| (!this.getQuantityMaxByProduct(parseInt(control.value))))
    return  { 'quantityRange': true };
    return null;
     
  }
}
  groupedItemsByProduct: any[] = [];
  getQuantityMaxByProduct(quantityEdited) {
    if(this._selectedBatch)
    if(quantityEdited>this._selectedBatch?.physicalAvailableQuantity)
    return false;
    let quantityMax = 0;
    let quantity = 0;
    // Check quantity is less then  packing quantity if zone is not origin
    if(this.data.line && this.data.line.packing != 0 && quantityEdited > 
      this.data.line.packing && this.data.currentZone.zoneType == 40) return false ;
      if(quantityEdited > this.data.line.packing && this.data.currentZone.zoneType != 30&& this.data.currentZone.zoneType != 10) return false ;
    // // Check Quantity modulo packing is always 0 if zone type is origin
    // if(quantityEdited % this.data.line.packing !=  0 && this.currentZone.zoneType == 30) return false ;
    // Check Quantity cumulated by productis less then cumulated in order
    let items = this.data
    .items.filter(ele => ele.productId == this.data.line.productId && ele.status != 20);
    items.forEach(element => {
      if(element.id == this.data.line.id ) quantity+=quantityEdited;
      else  quantity+=element.quantity;
    });
    quantityMax = this.groupedItemsByProduct.
    find(ele => ele.productId == this.data.line.productId).quantity;
    if(quantity > quantityMax) return false;
    else return true;
  }
  customModuloPackingValidation():ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {

    // Check Quantity modulo packing is always 0 if zone type is origin
    if(control.value==0) return null;
    if
    (
      
      this.formGroup &&(!control.value ||
      !this.data.line ||
      parseInt(control.value) % this.data.line.packing !=  0 
    &&
    this.data.currentZone.zoneType == 30)) return  { 'quantityByBox': true }; 

    else return null;

  }
}
  private async createFrom() {
    this.formGroup =await   this.fb.group({      

      
      
      internalBatchNumber: [null, [Validators.required]],
      
      unitPrice: [0, [Validators.required, this.UnitPriceValidator.bind(this)]],
            quantity: [this.data.line.quantity,
      [
        Validators.min(1),Validators.required,
        this.customMaxValidation(),
        this.customModuloPackingValidation()
    ]],
      expiryDate: [null, []],
      
      ppaPFS: [0, []],
      pfs: [0, []],
      
    });
  } 

  async ngOnInit() {
    this.productId=this.data.line["productId"];
    this.invent=this.data.batches; 
    this._selectedBatch=
    this.invent.find(i=>i.internalBatchNumber==this.data.line["internalBatchNumber"])??null;
    this.order = await this.orderService.GetOrderById(this.data.orderId).toPromise();
    
    this.blByOrder = <any>await this.orderPreparationService.getBlByOrder(this.data.orderId,
       this.data.line.pickingZoneId).toPromise();

    this.controlledOrderItem = this.blByOrder.items;
    this.groupedItemsByProduct = this.groupBy(this.order.orderItems);
    await this.createFrom(); 
     
    this.internalBatchNumber=this.data.line["internalBatchNumber"];
    
    this.gridLines = 'Both'; 
     
    if(this.productId) {
      this.discounts = await this.discountService.getActive(this.productId).toPromise();
      this.isLoadingHistory = true;
     
      this.internalBatchRef.focus();
      // this.internalBatchRef.open();
  
      this.isLoadingHistory = false;
      this.isSelected = false;
    

    } 
    
    
    this.formGroup.get("internalBatchNumber").valueChanges
    .subscribe(() => this.quantityRef.nativeElement.focus());
  }

 
  onToggle(event) {
    this.extraDiscountActivated = event.checked;
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
  

  
  
  async save () {
    if(this.formGroup.invalid) return;
    else  if(this.formGroup.value.quantity <= 0) {
      this.notif.showNotification('mat-warn',"La quantité doit être supérieure à 0",'top','right');
      return;
    
    
    } else {
      if(!this.isSavingItem) {
        this.isSavingItem = true;
        let zone = (this.zones.length > 0) ? this.zones.find(z => z.id == this.formGroup.value.pickingZoneId)
         : null;
         var line=this.data.line;
         line.internalBatchNumber=this.internalBatchNumber;
         line.expiryDate=this._selectedBatch.expiryDate;
         line.ppaPFS=this._selectedBatch.ppaPFS;
         line.pfs=this._selectedBatch.pfs;
         line.supplierId=this._selectedBatch.supplierId;
         line.supplierOrganizationId=this._selectedBatch.supplierOrganizationId;
         line.unitPrice=this._selectedBatch.unitPrice;
         line.packing=this._selectedBatch.packing;
        line.quantity=this.formGroup.get('quantity').value;
        
            this.dialogRef.close(line);
        
      }

    }
    this.isSavingItem = false;
  }
  
  close (){
    this.dialogRef.close(null);
  } 
  onClearSelection(selectedProduct) {
    this.productRef.focus();
    this.internalBatchRef.close();
    this.invent = [];
  }
  
  async onBatchSelection(selectedBatch) {
    this._selectedBatch=selectedBatch;
      this.availableQuantity = selectedBatch.physicalAvailableQuantity;
      this.formGroup.get('expiryDate').setValue(selectedBatch.expiryDate);
      let purchaseDiscountedPrice = (selectedBatch.purchaseDiscountRatio > 0) ? ((1 - selectedBatch.purchaseDiscountRatio) * selectedBatch.purchaseUnitPrice) : selectedBatch.purchaseUnitPrice;
      
      this.formGroup.get('unitPrice').setValue(selectedBatch.salesUnitPrice); 
      this.formGroup.get('pfs').setValue(selectedBatch.pfs);
      this.formGroup.get('ppaPFS').setValue(selectedBatch.ppaPFS);
      this.formGroup.get('packing').setValue(selectedBatch.packing);
      this.quantityRef.nativeElement.focus();
      <HTMLInputElement>this.quantityRef.nativeElement.select();
  }   
  keyPressed(e) {
    
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
   
  async onKeyDown(event) {
   try {
    this.scrolledProduct = <Product>this.productRef.dropdownPanel.markedItem.value;
    this.discounts = await this.discountService.getActive(this.scrolledProduct.id).toPromise();

   } catch (error) {
   }
  }
   
  getUg(quantity, discount) {
    let rateUg = this.calculHelper.calulTauxUg(discount) ;
    return this.calculHelper.calculUg(quantity,rateUg ).toFixed(1);
  }

  
  getDifferenceDates(ddp) {
    let toDay = new Date();
    let ddpDate = new Date(ddp); 
    let time_difference = this.dateHelper.difference(toDay,ddpDate) / 30;
    if(time_difference > 6) return true ;else return false;
  }

}
