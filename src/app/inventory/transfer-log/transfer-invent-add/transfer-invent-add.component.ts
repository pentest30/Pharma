import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgSelectComponent } from '@ng-select/ng-select';
import { InventService } from 'src/app/services/invent-service';
import { StockStateService } from 'src/app/services/stock-state.service';
import { TransferLogService } from 'src/app/services/transfer-log-service';
import { ZoneService } from 'src/app/services/zone-service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import * as uuid from 'uuid';
@Component({
  selector: 'app-transfer-invent-add',
  templateUrl: './transfer-invent-add.component.html',
  styleUrls: ['./transfer-invent-add.component.sass']
})
export class TransferInventAddComponent implements OnInit {
  invents : any [];
  public formGroup: FormGroup;
  inventId : string;
  stockStateId : string ;
  quantity : number = 0;
  zones : any[] = [];
  stockStates : any[] = [];
  stockStatesSource : any[] = [];
  fullStockStates : any[] = [];
  
  zoneId : string;
  zoneDestId : string;
  selectedProduct : any = null;
  selectedZoneSrc : any = null;
  selectedZoneDest : any = null;
  selectedStockState : any = null;
  stockStateSourceId :string = null;
  selectedStockStateSource :any = null;
  transferLogId : string;
  @ViewChildren('inventId') ngSelect:NgSelectComponent;
  @ViewChildren('zoneDestId') ngZone:NgSelectComponent;
  @ViewChildren('zoneId') ngZoneSrc:NgSelectComponent;
  @ViewChildren('stockStateSourceId') ngStockSrc:NgSelectComponent;
  @ViewChildren('stockStateDestId') ngStockDest:NgSelectComponent;
  
  count : number = 0;
  constructor(  private fb: FormBuilder,

    private zoneService : ZoneService,
    private stockStateService :StockStateService,
    private cdr: ChangeDetectorRef,
    private inventService : InventService, 
    private transferLogService : TransferLogService,
    private dialogRef: MatDialogRef<TransferInventAddComponent>,
    private notifHelper :NotificationHelper,
     @Inject(MAT_DIALOG_DATA) data,
 ) { 
   this.transferLogId = data.id;
   this.stockStateId = data.stockStateId;
   this.zoneDestId = data.zoneDestId;
   this.zoneId = data.zoneId;
   this.count = data.count;
   this.stockStateSourceId = data.stockStateSourceId; 

 }

  async ngOnInit() {
    this.zones = await this.zoneService.getAll().toPromise();
    this.stockStates = await this.stockStateService.getAll().toPromise();
    this.stockStatesSource = await this.stockStateService.getAll().toPromise();

    this.zones = this.zones.filter(x=>x.id!='7BD42E23-E657-4F99-AFEF-1AFE5CEACB16'.toLowerCase());
    this.stockStates = this.stockStates.filter(x=>x.id !='7BD13E23-E657-4F99-AFEF-1AFE5CEACB16'.toLowerCase());
    this.stockStatesSource = this.stockStatesSource.filter(x=>x.id !='7BD13E23-E657-4F99-AFEF-1AFE5CEACB16'.toLowerCase());
    
    if(this.zoneId) {
      this.invents = await this.inventService.getInventsByZone(this.zoneId, this.stockStateSourceId).toPromise(); 
      this.selectedStockState = this.stockStates.find(x=>x.id == this.stockStateId);
      this.selectedStockStateSource =this.stockStates.find(x=>x.id == this.stockStateId);
      this.selectedZoneDest = this.zones.find(x=>x.id == this.zoneDestId);
      this.selectedZoneSrc = this.zones.find(x=>x.id == this.zoneId);
    }
    this.fullStockStates = this.stockStates;
    this.createForm();
  }
  customProductSearchFn (term : string,item : any) {
    if(term) {
      term = term.toLocaleLowerCase();
       return  (item.productCode != undefined && item.productCode.toLocaleLowerCase().indexOf(term) > -1 )  
       || (item.productFullName != undefined && item.productFullName.toLocaleLowerCase().indexOf(term) > -1 ) ||
      item.productFullName.toLocaleLowerCase().indexOf(term) > -1;
     }
  }
  onProductSearch($event) {
 
  }
  onZoneBlur($event) {
  }

  onProductBlurSelection($event) {
    
  }
  onProductSelection($event) {
    this.selectedProduct = $event;
    this.formGroup.patchValue({"quantity":  $event.physicalQuantity})

  }
  onQuantityKeyEnter() {

  }
  onUnitPriceKeyEnter() {

  }
  close() {
    this.dialogRef.close();
  }
  save ( $event){
    if(!this.formGroup.valid) {
      return;
    }
    var transferLogItem = {
      id : this.transferLogId,
      zoneSourceId : this.formGroup.value.zoneId,
      zoneDestId : this.formGroup.value.zoneDestId,
      internalBatchNumber : this.selectedProduct.internalBatchNumber,
      inventId : this.formGroup.value.inventId,
      quantity  : this.formGroup.value.quantity,
      expiryDate : this.selectedProduct.expiryDate,
      productName : this.selectedProduct.productFullName,
      productCode : this.selectedProduct.productCode,
      productId : this.selectedProduct.productId,
      zoneSourceName : this.selectedZoneSrc.name,
      zoneDestName : this.selectedZoneDest.name,
      stockStateId : this.selectedStockState.id,
      stockStateName : this.selectedStockState.name,
      stockStateSourceId :this.selectedStockStateSource.id,
      stockStateSourceName : this.selectedStockStateSource.name

    };
    this.transferLogService.add(transferLogItem).subscribe(rsp=> {
      this.notifHelper.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
      this.dialogRef.close(transferLogItem);
    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  
  }
  onZoneDestSelection($event) {

    if($event){
      this.selectedZoneDest = $event;
      this.stockStates = this.stockStates.filter(x=>x.zoneTypeId == this.selectedZoneDest.zoneTypeId);

    }
    else this.stockStates = this.fullStockStates;
    
  }
  onStockStateSelection($event) {
    this.selectedStockState = $event;
  }
  async onStockStateSourceSelection($event){
  if($event)
  this.selectedStockStateSource = $event;
  this.invents = await this.inventService.getInventsByZone(this.zoneId, $event.id).toPromise();    
   
  }
  async onZoneSelection($event) {
     // gets invents by zone
     if($event){
       this.zoneId = $event.id;
   //   this.invents = await this.inventService.getInventsByZone($event.id).toPromise(); 
      this.selectedZoneSrc = $event;
      this.stockStatesSource = this.stockStatesSource.filter(x=>x.zoneTypeId == $event.zoneTypeId);
   
    }
    else this.stockStatesSource = this.fullStockStates;
  
    }
  quantityRangeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value  &&this.selectedProduct && (isNaN(control.value) || control.value <= 0 || control.value > this.selectedProduct.physicalQuantity)) {
          return { 'quantityRange': true };
      }
      return null;
       
    };
  }
 
  createForm() {
    this.formGroup = this.fb.group({
      id: [uuid.v4(), []],
      inventId : [this.inventId,[Validators.required]],
      quantity : [this.quantity, [Validators.min(1),Validators.required,this.quantityRangeValidator()]],
      zoneId : [this.zoneId, [Validators.required]],
      zoneDestId : [this.zoneDestId, [Validators.required]],
      stockStateId : [this.stockStateId, [Validators.required]],
      stockStateSourceId : [this.stockStateSourceId,[Validators.required]]
    });
  }
  
}
