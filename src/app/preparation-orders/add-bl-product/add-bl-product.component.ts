import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Discount } from 'src/app/discounts/discount-models/Discount';
import { InventSum } from 'src/app/inventory/inventsum/models/inventsum-model';
import { DiscountService } from 'src/app/services/discount.service';
import { InventSumService } from 'src/app/services/inventory.service';
import { PickingZoneService } from 'src/app/services/piking-zone.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { PreparationOrderItem } from '../models/PreparationOrderItem';
import * as uuid from 'uuid';

@Component({
  selector: 'app-add-bl-product',
  templateUrl: './add-bl-product.component.html',
  styleUrls: ['./add-bl-product.component.sass']
})
export class AddBlProductComponent implements OnInit {
  products: any;
  availableQuantity: any;
  zones: any [];
  errorMessages: string;
  error: boolean;

  constructor(private fb: FormBuilder,
    private notif: NotificationHelper,
    private route: Router,
    private zoneService: PickingZoneService,
    private inventoryService: InventSumService,
    private discountService: DiscountService,
    private dialogRef: MatDialogRef<AddBlProductComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    ) { 
      this.products = data.products;
    }
  public formGroup: FormGroup;
  discounts: Discount[] = [];
  invent: InventSum[] = [];
  productId: any;
  availableQuota: number;
  selectedProduct: any;
  @ViewChild("productId") productRef: NgSelectComponent;
  @ViewChild('productId') myElement: ElementRef;
  @ViewChild('internalBatch') internalBatchRef: NgSelectComponent;
  @ViewChild("quantity") quantityRef: ElementRef;

  async ngOnInit(): Promise<void> {
    await this.createFrom();
    this.getAllZones();
  }
  async getAllZones() {
    this.zones = await this.zoneService.getAll().toPromise(); 
  }
  private async createFrom() {
    this.formGroup = await this.fb.group({
      id: [uuid.v4(), [Validators.required]],
      orderId: [this.data.bl.orderId, [Validators.required]],
      quantity: [null, [Validators.min(1)]],
      packingQuantity: [null, []],
      packing: [null, []],
      productId: [null, [Validators.required]],
      productName: [null, [Validators.required]],
      defaultLocation: [null, []],
      internalBatchNumber: [null, [Validators.required]],
      productCode: [null, []],
      pickingZoneId: [null, []],
      discount: [0, []],
      extraDiscount: [0, []],
      expiryDate: [null, []],
      ppaHT: [0, []],
      status: [30, []],


    });
  }
  async onBatchSelection(selectedBatch) {
    this.availableQuantity = selectedBatch.physicalAvailableQuantity;
    let quantityMax = this.getQuantityMaxToAdd(this.selectedProduct.id);
    let find = this.data.groupedItemsByProduct.find(c => c.productId == this.formGroup.value.productId);

    let discount =  find.discount ;
    this.formGroup.get('expiryDate').setValue(selectedBatch.expiryDate);
    this.formGroup.get('discount').setValue(discount);
    this.formGroup.get('extraDiscount').setValue(selectedBatch.extraDiscount);
    this.formGroup.get('ppaHT').setValue(selectedBatch.ppaHT);
    this.formGroup.get('packing').setValue(selectedBatch.packing);

    if(this.data.zoneType == 10 || this.data.zoneType == 20 ) {
      this.formGroup.get('quantity').setValue(quantityMax);  
      this.formGroup.get('packingQuantity').setValue(Math.round(this.formGroup.value.quantity /  this.formGroup.value.packing));

      this.formGroup.controls['quantity'].setValidators([
        Validators.required, 
        Validators.max(quantityMax),
      ]); 
    }
    if(this.data.zoneType == 30 ) {
      if(selectedBatch.packing < quantityMax ) this.formGroup.get('quantity').setValue((quantityMax / selectedBatch.packing) * selectedBatch.packing ); 
      else this.formGroup.get('quantity').setValue(quantityMax);    
      console.log(this.formGroup.value.quantity /  this.formGroup.value.packing);
      this.formGroup.get('packingQuantity').setValue(Math.floor(this.formGroup.value.quantity /  this.formGroup.value.packing));

      this.formGroup.controls['quantity'].setValidators([
        Validators.required, 
        Validators.max((selectedBatch.packing < quantityMax ) ? (quantityMax / selectedBatch.packing) * selectedBatch.packing  : quantityMax),
      ]); 
    } 
    if(this.data.zoneType == 40 ) {
      if(selectedBatch.packing < quantityMax ) this.formGroup.get('quantity').setValue(selectedBatch.packing - 1);
      else this.formGroup.get('quantity').setValue(quantityMax);
      this.formGroup.get('packingQuantity').setValue(0);
   
      this.formGroup.controls['quantity'].setValidators([
        Validators.required, 
        Validators.max((selectedBatch.packing < quantityMax ) ?  selectedBatch.packing - 1: quantityMax),
      ]); 
    }
    

    this.formGroup.controls['quantity'].updateValueAndValidity();
    console.log(this.formGroup.value.quantity);

  }
  async onProductSelection(selectedProduct) {
    this.selectedProduct = selectedProduct;
    this.availableQuota = selectedProduct.quota;
    this.formGroup.get('internalBatchNumber').setValue(null);
    this.productId = selectedProduct.id;
    this.formGroup.get("productName").setValue(selectedProduct.fullName);
    this.formGroup.get("productId").setValue(selectedProduct.id);
    this.formGroup.get("productCode").setValue(selectedProduct.code);
    this.formGroup.get("defaultLocation").setValue(selectedProduct.defaultLocation);
    if (selectedProduct.pickingZoneId) this.formGroup.get('pickingZoneId').setValue(selectedProduct.pickingZoneId);

    let result = await this.inventoryService.getStockForSalesPerson(this.data.bl.organizationId, selectedProduct.id).toPromise();
    if(result != null) {
    
      this.invent = result;
    } else {
      this.productRef.focus();
      this.internalBatchRef.close();

      this.invent = [];
      this.notif.showNotification('mat-success','Produit indisponible','top','right');
      return false;
    }
    
    return false;
  }
  getQuantityMaxToAdd(productId: any) {
    let quantity = 0;
    let find = this.data.groupedItemsByProduct.find(c => c.productId == productId);
    console.log(find);
    this.data.items.forEach(element => {
      if(element.productId == productId && element.status != 20) quantity+= element.quantity;
    });
    console.log(quantity);

    return find.quantity - quantity
  }
  onProductSearch(event) {
 
  }
  customProductSearchFn (term:string , item : any) {
    if(term!=undefined) {
      term = term.toLocaleLowerCase();
       return  (item.code != undefined && item.code.toLocaleLowerCase().indexOf(term) > -1 )  || (item.manufacturer != undefined && item.manufacturer.toLocaleLowerCase().indexOf(term) > -1 ) ||
      item.fullName.toLocaleLowerCase().indexOf(term) > -1;
     }
  }
  quantityRangeValidator(): ValidatorFn {
   
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      alert();
        console.log(control.value % this.formGroup.value.packing);
        if (this.data.zoneType == 30 && control.value !== undefined && (isNaN(control.value) || control.value < 0 || control.value % this.formGroup.value.packing != 0)) {
            return { 'quantityRange': true };
        }
        return null;
       
    };
  }
  save() {
    let quantityMax = this.getQuantityMaxToAdd(this.selectedProduct.id);

    let quantityAdd = this.formGroup.get('quantity').value;
    let quantity = 0;
    this.data.items.forEach(element => {
      if(element.id == this.formGroup.value.id) quantity+=element.quantity;
    });
    if(this.data.zoneType == 30 && quantityAdd % this.formGroup.value.packing != 0) {
      this.error = true;
      this.errorMessages = "Quantité erroné dans la zone d'origine, veuiller rajouter la quantité dans les zones vrac";
      return;
    }
    if( this.data.zoneType == 30 && (quantity + quantityAdd) % this.formGroup.value.packing != 0 ) {
      this.error = true;
      this.errorMessages = "La somme des quantités a depassé le colisage du lot choisi, veuiller la rajouter BL d'origine ou changer le  lot";
      return;
    }
    if(this.formGroup.invalid) return;


    let blItem =  new PreparationOrderItem();
    this.formGroup.get('packingQuantity').setValue(Math.floor(this.formGroup.value.quantity /  this.formGroup.value.packing));

    blItem = this.formGroup.value;

    console.log(this.formGroup.value.quantity);
    this.dialogRef.close(blItem);
  }

  close (){
    this.dialogRef.close(null);
  }
}
