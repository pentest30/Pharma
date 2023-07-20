import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { InventSumService } from 'src/app/services/inventory.service';
import { PickingZoneService } from 'src/app/services/piking-zone.service';
import { PreparationOrdersService } from 'src/app/services/preparation-orders.service';
import { DialogHelper } from 'src/app/shared/DialogHelper';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import * as uuid from 'uuid';
import { OrdersService } from 'src/app/services/orders.service';
import { ErrorParseHelper, Result } from 'src/app/shared/helpers/ErrorParseHelper';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ScanFormComponent } from '../scan-form/scan-form.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DateHelper } from 'src/app/shared/date-helper';
import { concat, Observable, of, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { debounceTime, distinctUntilChanged, mergeMap, delay, switchMap, startWith, debounce, tap, catchError, distinctUntilKeyChanged } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { StripedLineReason } from '../models/PreparationOrderItem';

@Component({
  selector: 'app-op-form-control',
  templateUrl: './op-form-control.component.html',
  styleUrls: ['./op-form-control.component.scss']
})
export class OpFormControlComponent implements OnInit {
  started: boolean | undefined;

  op: any;
  barcodeFormControl = new FormControl(); 
  packingPickingZoneControl = new FormControl(); 
  executedByIdControl = new FormControl(); 
  executedByNameControl = new FormControl(); 

  productIdControl = new FormControl(); 
  blockingReason = new FormControl(); 

  @ViewChild('executedByName') excutersSelect: MatSelect;
  order: any;
  loading: boolean = false;
  isOpen: any;
  isMobile: boolean;
  isTablet: boolean;
  isDesktopDevice: boolean;
  scanLoading: boolean = false;
  filterValuesLoading: boolean;
  storedOpItems: string;
  barCode: string;
;
  @ViewChild('numberOfPackages') numberOfPackages:ElementRef;
  @ViewChild('barcodeRef') barcodeRef: ElementRef;
  items: any[] = [];
  products: any[] = [];
  quantityFormControl = new FormControl('', [Validators.required, Validators.email]);
  executers: any[];
  listBatchs: any[] = [];
  errorMessage: string;
  error: boolean;
  canAddOrSave: boolean = true;
  groupedItemsByProduct: any[];
  controlledOrderItem: any;
  blByOrder: any;
  zones: any;
  currentGroupZone: any;
  currentZone: any;
  quantityMax: number;
  currentUser: any;
  value: string;
  isError = false;
  barcodeValue;
  deviceInfo = null;
  searchable = true;
  public keyUp = new Subject<KeyboardEvent>();

  batchs = [];
  batchBuffer = [];
  batchSize = 50;
  loadingselect = false;
  input$ = new Subject<string>();
  batchsBuffer$:Observable<any>;
  filteredOptions: Observable<any[]>;
  quantityControlOp = new Subject<any>();
  stripedLineReasonList: (any | StripedLineReason)[];
  public stripedLineReasons = StripedLineReason;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private orderPreparationService : PreparationOrdersService,
    private inventoryService: InventSumService,
    private employeeService: EmployeeService,
    private orderService : OrdersService,
    private parseErrorHelper: ErrorParseHelper,
    private readonly _dialog: MatDialog,
    private pickingZoneService : PickingZoneService,
    private dialogHelper: DialogHelper,
    private authService: AuthService,
    private notif: NotificationHelper,
    private deviceService: DeviceDetectorService,
    private dateHelper: DateHelper,
    private activatedRoute: ActivatedRoute


    ) {

    }
    @HostListener("window:beforeunload", ["$event"])
    unloadHandler(event) {
        return false;
    } 
  async ngOnInit() {
    this.currentUser =  <any>await this.authService.user;
    this.executers = await this.employeeService.getAll(1).toPromise();
    this.zones = await this.pickingZoneService.getAll().toPromise();
    console.log(this.zones);
     // set focus to input
     setTimeout(() => {
      this.barcodeRef.nativeElement.focus();

      this.barcodeFormControl.setValue('', { emitEvent: false });
    }, 0);
    this.getDevice();
    this.filteredOptions = this.executedByNameControl.valueChanges.pipe(
      startWith(''),
      tap(_ => {
       
      }),
      map(value => this._filter(value || '')),
    );
    this.quantityControlOp.pipe(
      debounceTime(100),)
      .subscribe((item) => {
        try {
          this.onQuantityChange(item, item.quantity);

        } catch (error) {
          
        }
      });
    this.barcodeRef.nativeElement.focus();
    

    this.activatedRoute.queryParams
    .subscribe(  params => {
      this.barcodeFormControl.setValue(null, { emitEvent: true });
      this.barcodeFormControl.setValue(params.barecode, { emitEvent: true });
      this.barcodeFormControl.updateValueAndValidity({emitEvent: true, onlySelf: false});
      this.scanBarcode(params.barecode);

    });
    this.stripedLineReasonList = Object.values(this.stripedLineReasons).filter(
      (f) => !isNaN(Number(f))
    );  
  }
  
  keyUpEvent(item, newQuantity) {
    setTimeout(() => {
      this.onQuantityChange(item, newQuantity);
    }, 400);
  }
  async ngAfterViewInit() {

  }
  onSearch(element) {
    this.batchBuffer = this.batchs.slice(0,50);
    this.batchsBuffer$ = of(this.batchBuffer);
    this.input$.pipe(
      startWith(''),
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => this.filterValuesLoading = true),
      switchMap(term => this.inventoryService.getPickingInventFromAx({
        productCode:element.productCode,
        zoneName:this.currentZone.name
      }))
    )
      .subscribe(data => {
        let batchs =<any> data;
        this.items.forEach(item => {
          if(item.productId == element.productId) {
            batchs.map(c => {
              if(c.internalBatchNumber == item.internalBatchNumber 
                // || ((item.status == 30 || item.status == 90) && c.internalBatchNumber == item.previousInternalBatchNumber)
                ) {
                c.disabled = true;
              }
              return c;
            });
          }
        });
        this.batchsBuffer$ = of(batchs);
         this.filterValuesLoading = false;

      })
  }
  getDevice() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktopDevice = this.deviceService.isDesktop();
    if(this.isTablet || this.isMobile) {
    }
  }
  async scanBarcode(barCode) {
    if(!barCode) return;
    this.scanLoading = true;
    if(this.op != null) {
      this.op.preparationOrder = null;
      this.items = [];
      this.currentGroupZone = null;
      this.currentZone = null;
      this.listBatchs = [];
      this.scanLoading = false;

    }
  
    if(barCode && barCode.length >= 14 || barCode == null ) {
      this.op = await this.orderPreparationService.getByBarCode(barCode).toPromise();
      if(this.op && this.op.preparationOrder != null) {
        // this.excutersSelect.focus();
        this.items = this.op.preparationOrder.preparationOrderItems;
        let temp = [];
        this.currentZone = this.zones.find(ele => ele.id ==  this.items[0].pickingZoneId);
        if(this.currentZone.zoneType == 30) {
          const sum = this.items.reduce((accumulator, object) => {
            return accumulator + object.packingQuantity;
          }, 0);
          this.packingPickingZoneControl.setValue(sum);
        }
        for (let index = 0; index < this.items.length; index++) {
          const element = <any>this.items[index];
          element.isValidated = false ;
          element.errorMessage = null;
          temp.push(element);
       
        }
        this.items = temp;
        this.products = [...new Map(this.items.map(item => [item["productId"], item])).values()];
        this.blByOrder = (<any>await this.orderPreparationService.getBlByOrder(this.op.preparationOrder.orderId, this.items[0].pickingZoneId).toPromise());
        this.controlledOrderItem = this.blByOrder.items;
        this.order = await this.orderService.GetOrderById(this.op.preparationOrder.orderId).toPromise();
        this.groupedItemsByProduct = this.groupBy(this.order.orderItems);
        this.currentGroupZone = this.zones.find(ele => ele.zoneGroupId == this.op.preparationOrder.zoneGroupId);
        this.storedOpItems = localStorage.getItem(barCode);
        (this.storedOpItems == null) ? localStorage.setItem(barCode, JSON.stringify(this.items)) : this.items = JSON.parse(this.storedOpItems);
        this.barCode = barCode;
        this.items.sort((a, b) => (

          (a.defaultLocation == null) ? 
          a :
          a.defaultLocation.localeCompare(b.defaultLocation) || a.productName.toLowerCase().localeCompare(b.productName.toLowerCase())
         ));
      } else  {
        this.notif.showNotification('mat-warn',this.op?.errorMessages.Error,'top','right');
        localStorage.removeItem(this.barCode);
      }

    } else {
      this.barcodeFormControl.setValue(null);
      this.barcodeRef.nativeElement.focus();
      this.notif.showNotification('mat-warn','Code à barre erroné','top','right');
    }
   
    this.scanLoading = false;
    this.barcodeFormControl.setValue(null);
  }
  async saveAgentControl() {
    //this.numberOfPackages.nativeElement.focus();
    await this.orderPreparationService.addAgents({
      preparationOrderId: this.op.preparationOrder.id,
      pickingZoneId: this.items[0].pickingZoneId,
      pickingZoneName: this.items[0].pickingZoneName,
      executedById: this.executedByIdControl.value,
      executedByName: this.executers.find(c => c.id == this.executedByIdControl.value).name,
      verifiedByName: this.currentUser.profile.userName,
      verifiedById: this.currentUser.profile.sub,
    }).toPromise();

  }
  selectExecuter(agent) {
    console.log(agent);
    this.executedByIdControl.setValue(agent.option.value.id);
    this.executedByNameControl.setValue(agent.option.value.name);

    // this.onExecuterSelection();
  }

  customEmployeeSearchFn(term:string , item : any) {
    if(term!=undefined) {
      term = term.toLocaleLowerCase();
      let part1 = term.split(" ")[0];
      let part2 = term.split(" ")[1];
      if(part2 && item.hrCode) {
        return      ( item.hrCode.toLocaleLowerCase().indexOf(part1) > -1 && item.hrCode.toLocaleLowerCase().indexOf(part2) > -1) ;
 
      }
       return  (item.hrCode != undefined && item.hrCode.toLocaleLowerCase().indexOf(term) > -1 )  
       || (item.name != undefined && item.name.toLocaleLowerCase().indexOf(term) > -1 )  ;
    }

  }
  enter_executer(auto) {
    setTimeout(() => {
      console.log(auto);
      auto.options.first.select();

    }, 100);
  }
 
  private _filter(value): string[] {
    if (typeof value == 'string') {
      const filterValue = value.toLowerCase();
      return this.executers.filter(option => option.name.toLowerCase().includes(filterValue) || option.hrCode == filterValue);
    }

    return this.executers;
  }

  onBatchSelection(selectedItem, item) {
   
    this.quantityMax = this.getQuantityMaxToAdd(item.productId);
    this.items.map(element => {
      if(element.id == item.id && element.status == 90) 
      {
        element.internalBatchNumber = selectedItem.internalBatchNumber;
        element.expiryDate = selectedItem.expiryDate;
        element.discount = (item.discount == null) ? 0 : item.discount;
        element.extraDiscount = item.extraDiscount;
        element.ppaHT = selectedItem.ppaHT;
        element.packing = selectedItem.packing;
        element.vendorBatchNumber = selectedItem.vendorBatchNumber;
        element.status = 30;
        if(selectedItem.physicalAvailableQuantity < item.quantity) {
          element.errorMessage =  ["Quantité du lot selectionnée est inferieur a la quantité autorisée"];

        }

      } else if(element.id == item.id && element.status != 90) {
        //console.log(item);
       // element.previousInternalBatchNumber = item.internalBatchNumber;
        element.internalBatchNumber = selectedItem.internalBatchNumber;
        element.expiryDate = selectedItem.expiryDate;
        element.discount = (item.discount == null) ? 0 : item.discount;
        element.extraDiscount = item.extraDiscount;
        element.ppaHT = selectedItem.ppaHT;
        element.packing = selectedItem.packing;
        element.vendorBatchNumber = selectedItem.vendorBatchNumber;
        element.status = 40;
        if(selectedItem.physicalAvailableQuantity < item.quantity) {
          element.errorMessage =  ["Quantité du lot selectionnée est inferieur a la quantité autorisée"];

        }
      }

    });
    localStorage.setItem(this.barCode, JSON.stringify(this.items))

    this.canSaveOrAdd();

    // let nextElementToFocus = document.getElementById("productId_"+ item.id);
    // nextElementToFocus.focus();
  }
  async delete(row) {
    if(row.blockingReason == null) {
      this.notif.showNotification('mat-warn','Motif de blockage est obligatoire','top','right');
      return;
    }
    if(row.status == 90) this.items = this.items.filter(ele => ele.status != 90);
    else if(row.status == 30)
    this.items = this.items.filter(ele => ele.id != row.id);
    else {
      this.items.map(ele => {
        if( ele.id == row.id) {
          if(ele.status == 20) {
            ele.status =  10;
            ele.isValidated = false;
            ele.StripedLineReason = null;

          } else {
            ele.status =  20;
            ele.isValidated = true;
            ele.StripedLineReason = row.stripedLineReason;
            if(ele.previousInternalBatchNumber != row.internalBatchNumber   ) ele.internalBatchNumber = ele.previousInternalBatchNumber;
            if(row.quantity != ele.oldQuantity ) ele.quantity = ele.oldQuantity;
           
          }
        }
      });
    }
    let NotDeletedItems = this.items.filter(c => c.status != 20);
    if(NotDeletedItems.length == 0 ) {
      this.packingPickingZoneControl.setValue(0);
      this.packingPickingZoneControl.disable();
    }
    this.canSaveOrAdd();

    this.items = [...this.items];
    localStorage.setItem(this.barCode, JSON.stringify(this.items))


  }
  cancel(row) {
    this.items.map(ele => {
      if(ele.id == row.id)
      ele.isValidated = false;
      return ele;
    });
    localStorage.setItem(this.barCode, JSON.stringify(this.items))

  }
  validate(row ) {
    if(row.internalBatchNumber == null || row.quantity == 0 || row.quantity == null) {
      this.notif.showNotification('mat-warn','Impossible de valider la ligne , quantité ou lot est vide','top','right');
      return;
    }
    console.log(row.blockingReason);
    if(row.blockingReason != null) {
      this.notif.showNotification('mat-warn','Impossible de valider la ligne avec un motif de blocage','top','right');
      return;
    }
    this.items.map(ele => {
      if(ele.id == row.id) {
        ele.isValidated = true;
        let qte = this.getQuantityMaxToAdd(row.productId);

        if(qte > 0 && ele.quantity < ele.oldQuantity ) {

          this.duplicate(row);
        }
      }
      return ele;
    });
    localStorage.setItem(this.barCode, JSON.stringify(this.items))

  }

  duplicate(row) {
    let qte = this.getQuantityMaxToAdd(row.productId);
    if(qte == 0) {
      this.notif.showNotification('mat-warn','Impossible de dupliquer le produit, quantité total consommée','top','right');
      return ;
    }
    if(this.canAddOrSave == false ) this.error = true;
    else {
      let qte = this.getQuantityMaxToAdd(row.productId);

      let line = {
        id: uuid.v4(),
        orderId : this.op.preparationOrder.orderId,
        productId : row.productId,
        productName : row.productName,
        productCode : row.productCode,
        defaultLocation : row.defaultLocation,
        pickingZoneId : row.pickingZoneId,
        pickingZoneName : row.pickingZoneName,
        zoneGroupId : row.zoneGroupId,
        zoneGroupName : row.zoneGroupName,
        pickingZoneOrder : row.pickingZoneOrder,
        status : 90 ,
        expiryDate  :null,
        internalBatchNumber :null,
        oldQuantity: 0,
        previousInternalBatchNumber: row.previousInternalBatchNumber,
        quantity :qte,
        isValidated: false,
        packingQuantity: 0,
        discount :row.discount,
        extraDiscount:row.extraDiscount,
        ppaHT :null,
        packing :null,
      };
      this.items.push(line);   
     }
     this.items.forEach(c => {
        this.listBatchs.map(batch => {
          if(c.productId == row.productId && (c.status == 90 || c.status == 30) ) {
            batch.batchs.map(batchItem => {
              let find = this.items.find(c => c.internalBatchNumber == batchItem.internalBatchNumber );
              if(find != null) batchItem.disabled = true;
              else batchItem.disabled = false;

              // if(c.previousInternalBatchNumber == batchItem.internalBatchNumber) {
              //   batchItem.disabled = true;
              // }
              return batchItem
            });
          }
          return batch;
        });
       
     });

     this.items.sort((a, b) => (

      (a.defaultLocation == null) ? 
      a :
      a.defaultLocation.localeCompare(b.defaultLocation) || a.productName.toLowerCase().localeCompare(b.productName.toLowerCase())
     ));
     localStorage.setItem(this.barCode, JSON.stringify(this.items));

  
  }
  // onMouseOutQuantity(item) {
  //   let nextElementToFocus = document.getElementById("productId_"+ item.id);
  //   nextElementToFocus.click();
  
  // }
  customBatchSearchFn (term:string , item : any) {
    if(term!=undefined) {
      term = term.toLocaleLowerCase();
      if(term && item.internalBatchNumber) {
        return( item.internalBatchNumber.toLocaleLowerCase().startsWith(term) ) ;
 
      }
    }
  }
  canSaveOrAdd() {
    let canSave = [];
    this.items.map(ele => {
      let qte = this.getQuantityMaxToAdd(ele.productId);
      if(qte<0) {
        ele.errorMessage =  ["Quantité par produit dépassée"];
      } else ele.errorMessage =  null;
      canSave.push(qte);
      return ele;
    });
    if(canSave.filter(ele => ele < 0).length > 0) {
      this.error = true;
      // this.errorMessage = 'quantité dépassée ou insuffisante';
      //this.notif.showNotification('mat-warn','Quantité dépassée ou insuffisante','top','right');

      this.canAddOrSave = false;
      return true;

    }
    else {
      this.canAddOrSave = true;

      return false
    }
  }
  getQuantityMaxToAdd(productId: any) {
    let quantity = 0;
    let find = this.groupedItemsByProduct.find(c => c.productId == productId);
    let qteByProductByZone = 0;
    this.controlledOrderItem.forEach(c =>  {
      if(c.pickingZoneId == this.currentZone.id && c.productId == productId) {
        qteByProductByZone+=c.quantity;
      }
    });
    this.items.forEach(element => {
      if(element.productId == productId && element.status != 20) quantity+= parseInt(element.quantity);
    });
    return qteByProductByZone - quantity
  }
  groupBy(list) {
    var result = [];

    list.forEach(element => {
      let quantityControlled = 0;
      let controlledOrderItemByProduct = this.controlledOrderItem.filter(e => e.productId == element.productId && e.isControlled)
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

      if(find == null) {
        result.push({
          productId : element.productId,
          productName : element.productName,
          productCode : element.productCode,
          defaultLocation : element.defaultLocation,
          quantity : sumOfQuantity - quantityControlled,
          initial: sumOfQuantity,
          controlled: quantityControlled,
          discount: minDiscount
        });
      }

    });
    return result;
  }

  onQuantityChange(item, newQuantity) {
    let quantity = 0;
    let quantityMax = 0;
    if(newQuantity == 0 ) {
      this.notif.showNotification('mat-warn','Quantité doit etre superieur a 0','top','right');
      return;

    }
    // if(item && item.internalBatchNumber != null && item.packing != null && item.packing != 0 && parseInt(newQuantity) > item.packing && this.currentZone.zoneType == 40) {
    //   //  this.error = true;
    //   //  this.notif.showNotification('mat-warn','Quantité zone vrac doit être inférieur au colisage ','top','right');
    //    this.items.map( ele => {
    //     if(item.id == ele.id) {
    //       // ele.quantity = parseInt(ele.oldQuantity);
    //       ele.errorMessage = ["Quantité zone vrac doit être inférieur au colisage"];
    //     }
    //     return ele;
    //   });
    //   return;
    // } 

    // Check Quantity cumulated by productis less then cumulated in order
    let items = this.items.filter(ele => ele.productId == item.productId && ele.status != 20);
    items.forEach(element => {
      if(element.id == item.id ) quantity+=parseInt(newQuantity);
      else  quantity+=element.quantity;
    });

    quantityMax = this.groupedItemsByProduct.find(ele => ele.productId == item.productId).quantity;
    if(quantity > quantityMax) {
      // Invalid case , return old value
      this.items.map( ele => {
        if(item.id == ele.id) {
          ele.errorMessage = ["Quantité maximum dépassée"];

          //ele.quantity = parseInt(ele.oldQuantity);
        }
        ele.errorMessage = null;

        return ele;
      });
    }
    else {
      this.items.map( ele => {
        if(item.id == ele.id) {
          ele.quantity = parseInt(newQuantity);
          if(item.status == 10) ele.status = 40;
        }
        ele.errorMessage = null;

        return ele;
      });
     
      // return true;
    }
    this.canSaveOrAdd();
    localStorage.setItem(this.barCode, JSON.stringify(this.items))

  }
  onReasonSelection(item, reason) {
    this.items.map(element => {
      if(element.id == item.id ) {
        element.blockingReason = reason;
      }
      return element;

    });
    console.log(this.items);
  }
  checkLastBl() {
    let isQuantityCorrect = [];
    this.groupedItemsByProduct.forEach(element => {
      const sumByProduct = this.items.filter(c => c.productId == element.productId && c.status != 20).reduce((sum, currentValue) => {
        return sum + currentValue.quantity;
      }, 0);
      if(sumByProduct + element.controlled > element.initial) {
        isQuantityCorrect.push(false);
        this.error = true;
        this.errorMessage = 'Les quantité du produit '+ element.productName +'depasse celle du bon de commande';
      } else isQuantityCorrect.push(true);

    });
    if(isQuantityCorrect.find(ele => !ele) != null ) return false; else return true;
  }
  onQuantityModelChange(item) {
    this.quantityControlOp.next(item)
  }
  isNotValidated() {
    return this.items.some(c => !c.isValidated)  ;
  }
  getDifferenceDates(ddp, numberMonth) {
    let toDay = new Date();
    let ddpDate = new Date(ddp); 
    let time_difference = this.dateHelper.difference(toDay,ddpDate) / 30;
    if(time_difference < numberMonth) return true ;else return false;
  }
  async save() {
    if(!this.loading) {
      this.loading = true; 
      // Recalculate packinf if zone zone origin
     
      if(this.currentZone.zoneType == 30) {
        let packing = 0;
        let itemsNotDeletes = this.items.filter(c => c.status != 20);
        itemsNotDeletes.forEach(item => {
          console.log(item.packing);

          if(item.packing != null && item.packing != 0) 
          packing+= Math.floor(item.quantity/ item.packing);  
        });
        console.log(packing);
        this.packingPickingZoneControl.setValue(packing);

      }
      // Fin
      let command = {
        id : this.op.preparationOrder.id,
        totalPackage: (this.currentZone.zoneType != 10 && this.packingPickingZoneControl.value != null) ? this.packingPickingZoneControl.value : 0,
        TotalPackageThermolabile: (this.currentZone.zoneType == 10 && this.packingPickingZoneControl.value != null) ? this.packingPickingZoneControl.value : 0,
        preparationOrderItems: this.items,
        pickingZoneId: this.items[0].pickingZoneId,
        pickingZoneName: this.items[0].pickingZoneName,
        executedById: this.executedByIdControl.value,
        executedByName: this.executers.find(c => c.id == this.executedByIdControl.value).name,
        verifiedByName: this.currentUser.profile.userName,
        verifiedById: this.currentUser.profile.sub,
      };
      // Check if last bl to controll , all order quantity is valid
      let checkLastBlresult = true;
      if(this.blByOrder.countBlNotControlled == 1) checkLastBlresult = this.checkLastBl();
      if(this.canAddOrSave == true && checkLastBlresult == true) {
        let result = <any>await this.orderPreparationService.update(command).toPromise();
        if(result == null) {
          //Change state Op to controlled 
          // await this.orderPreparationService.controlOp(this.op.preparationOrder.id).toPromise();
          
          this.notif.showNotification('mat-primary',"Zone controllée avec succès" ,'top','right');
          // this.saveAgentControl();
          localStorage.removeItem(this.barCode);
          this.items = [];
          this.op = null;
          this.barcodeFormControl.setValue(null);
          this.packingPickingZoneControl.setValue(null);
          this.executedByIdControl.setValue(null);
          this.executedByNameControl.setValue(null);

          this.listBatchs = [];
          this.barcodeRef.nativeElement.focus();
        } else {
          let invalidFirstId = null ;
          if(result.orderValidationErrors != null && result.orderValidationErrors!="") {
            let error = Object.keys(result.orderValidationErrors).map(k => result.orderValidationErrors[k]);
            this.notif.showNotification('mat-warn',error,'top','right');
            this.loading = false;
          }
          this.items.map(ele => {
            let invalidItem = result.invalidItems.find(c => c.internalBatchNumber == ele.internalBatchNumber && c.productCode == ele.productCode);
            console.log(invalidItem);
            if(invalidItem != null) {
              if (invalidFirstId == null) {
                
                invalidFirstId = this.items.find(c => c.internalBatchNumber == invalidItem.internalBatchNumber && c.productCode == invalidItem.productCode).id;
              }
              ele.errorMessage = Object.keys(invalidItem.orderItemValidationErrors).map(k => invalidItem.orderItemValidationErrors[k]) ;
              
              ele.isValidated = false;
            }
            return ele;
          });
          console.log(invalidFirstId);
          let nextElementToFocus = document.getElementById("productId_"+ invalidFirstId);
          this.loading = false;
          nextElementToFocus.focus();
          // const y = nextElementToFocus.getBoundingClientRect().top + window.pageYOffset + yOffset;
          let cardScroll = document.getElementById("card_"+ invalidFirstId);

          cardScroll.scrollIntoView({ behavior: 'smooth', block: 'center', inline: "nearest" });
          // Display line with errors and activate update for them

        }
        this.loading = false;


      }
      else {
        this.loading = false;
        this.notif.showNotification('mat-warn','Quantité produit dépassée','top','right');
        this.error = true;
      }
    } else {
      this.notif.showNotification('mat-warn',"Veuillez attendre la fin de l'operation en cours ..." ,'top','right');

    }
   
  }


  openScan() {
    this.barcodeFormControl.setValue(null);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { 
    };
    dialogConfig.disableClose = true;

    if(!this.isOpen)  {
      var modalRef = this._dialog.open(ScanFormComponent, dialogConfig);
      this.isOpen = true;
      modalRef.afterClosed().subscribe(res => {
        this.isOpen = false;
        this.barcodeFormControl.setValue(res);
        this.scanBarcode(res);
      });
    }
  }
  
 }
 
