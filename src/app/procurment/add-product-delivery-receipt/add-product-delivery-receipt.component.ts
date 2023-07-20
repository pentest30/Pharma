import { I } from '@angular/cdk/keycodes';
import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DeliveryReceiptService } from 'src/app/services/delivery-receipt.service';
import { ProductService } from 'src/app/services/product.service';
import { CalculMethodHelper } from 'src/app/shared/CalculMethodHelper';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { CreateReceiptItemCommand } from '../models/DeliveryReceiptItem';
import { SupplierInvoice } from '../models/SupplierInvoice';
import { SupplierInvoiceItem } from '../models/SupplierInvoiceItem';

@Component({
  selector: 'app-add-product-delivery-receipt',
  templateUrl: './add-product-delivery-receipt.component.html',
  styleUrls: ['./add-product-delivery-receipt.component.sass']
})
export class AddProductDeliveryReceiptComponent implements OnInit {

  products: SupplierInvoiceItem[] = [];
  refDoc: any;
  isPsy: boolean;
  form: any;
  rows: any = [];
  public formGroup: FormGroup;
  @ViewChild("productId") productRef: NgSelectComponent;
  productId: any;
  errorMessages: string;
  cachedProduct: any[] = [];
  supplierInvoice: SupplierInvoice;
  navigation: any;
  error: boolean = false;
  @ViewChild('quantity') quantityRef: ElementRef;
  @ViewChild('packing') packingRef: ElementRef;
  @ViewChild('packingNumber') packingNumberRef: ElementRef;
  @ViewChild('pfs') pfsRef: ElementRef;
  @ViewChild('ppa') ppaRef: ElementRef;
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    switch (event.key) {
      case "Escape":
        event.preventDefault();
        this.close();
        break;
    }
  }
  constructor(private fb: FormBuilder,
    private notif: NotificationHelper,
    private deliveryReceiptService: DeliveryReceiptService,
    private calculHelper: CalculMethodHelper,
    private productService: ProductService,
    private dialogRef: MatDialogRef<AddProductDeliveryReceiptComponent>,
     @Inject(MAT_DIALOG_DATA) private data) {
      this.products = [];
      this.products = this.data.supplierInvoice.items;
      this.form = this.data.form;
      this.refDoc =  this.data.form.refDocument;
      this.rows = this.data.rows;

     
    }
  async ngOnInit() {
    await this.createFrom();
    this.formGroup.get("productId").valueChanges
      .subscribe(() => {
        this.productRef.focus();
    });
    
  }
  async getInternalBatch() {
    
  }
  
  // On key enter focus next input 
  onPackingNumberKeyEnter(event) {
    if(this.formGroup.value.packingNumber != '' && this.formGroup.value.packingNumber != null)
    this.ppaRef.nativeElement.focus();

  }
  onPackingKeyEnter(event) {
    if(this.formGroup.value.packing != '' && this.formGroup.value.packing != null)
    this.packingNumberRef.nativeElement.focus();
  }
  onQuantityKeyEnter(event) {
  }
  
  onBulkKeyEnter(event) {
    if(this.formGroup.value.salePrice != '' && this.formGroup.value.salePrice != null)
    this.pfsRef.nativeElement.focus();
  }
  onPfsKeyEnter(event) {
    this.ppaRef.nativeElement.focus();
  }
  onPpaKeyEnter(event) {
    this.ppaRef.nativeElement.focus();
  }

  customProductSearchFn (term:string , item : any) {
    if(term!=undefined) {
      term = term.toLocaleLowerCase();
      let part1 = term.split(" ")[0];
      let part2 = term.split(" ")[1];
      if(part2 && item.fullName) {
        return ( item.fullName.toLocaleLowerCase().indexOf(part1) > -1 && item.fullName.toLocaleLowerCase().indexOf(part2) > -1) ;
      }
      return  (item.code != undefined && item.code.toLocaleLowerCase().indexOf(term) > -1 )  
       || (item.manufacturer != undefined && item.manufacturer.toLocaleLowerCase().indexOf(term) > -1 ) 
       || ( (item.fullName) ? item.fullName.toLocaleLowerCase().indexOf(part1) > -1 : true ) ;
    }
  }
  //Form creation
  private async createFrom() {
    this.formGroup = await this.fb.group({
      productId: [null, [Validators.required]],
      productName: [null, [Validators.required]],
      productCode: [null, [Validators.required]],
      quantity: [null, [Validators.min(1),Validators.required,Validators.min(1)]],
      internalBatchNumber: [null, [Validators.required]],
      vendorBatchNumber: [null, [Validators.required]],
      unitPrice: [0, [Validators.required]],
      salePrice: [null, [Validators.required]],
      expiryDate: [null, [Validators.required]],
      packing: [0, []],
      packingNumber: [0, []],
      bulk: [0, [Validators.required,Validators.min(0)]],
      pfs: [null, [Validators.required]],
      ppa: [null, [Validators.required]],
    });
  }
 
  close (){
    this.dialogRef.close(null);
  }
  
   onProductBlurSelection(event) {    
     if(this.formGroup.value.productId == null) this.productRef.focus();
  }
 
  async onProductSelection(selectedProduct) {
    if(selectedProduct != null){
    let product = this.rows.find(x => x.productId == selectedProduct.productId && x.internalBatchNumber == selectedProduct.internalBatchNumber);
    if(product != null){
      this.formGroup
        .get("packingNumber")
        .setValue(
          (selectedProduct.remainingQuantity - product.quantity) /
            product.packing
        );
      this.formGroup
        .get("bulk")
        .setValue(
          (selectedProduct.remainingQuantity - product.quantity) %
            product.packing
        );
      this.formGroup
        .get("quantity")
        .setValue(selectedProduct.remainingQuantity - product.quantity);
    }else{
      this.formGroup
        .get("packingNumber")
        .setValue(selectedProduct.remainingQuantity / selectedProduct.packing);
      this.formGroup
        .get("bulk")
        .setValue(selectedProduct.remainingQuantity % selectedProduct.packing);
      this.formGroup
        .get("quantity")
        .setValue(selectedProduct.remainingQuantity);
    }
    this.productId = selectedProduct.id;
    this.formGroup.get("productName").setValue(selectedProduct.productName);
    this.formGroup.get("productId").setValue(selectedProduct.productId);
    this.formGroup.get("productCode").setValue(selectedProduct.productCode);
    this.formGroup.get("internalBatchNumber").setValue(selectedProduct.internalBatchNumber);
    this.formGroup.get("vendorBatchNumber").setValue(selectedProduct.vendorBatchNumber);
    this.formGroup.get("unitPrice").setValue(selectedProduct.purchaseUnitPrice);
    this.formGroup.get("salePrice").setValue(selectedProduct.salePrice);
    this.formGroup.get("expiryDate").setValue(selectedProduct.expiryDate);
    this.formGroup.get("ppa").setValue(selectedProduct.ppaHT);
    this.formGroup.get("pfs").setValue(selectedProduct.pfs);
    this.formGroup.get("packing").setValue(selectedProduct.packing); 
  }else{
    this.formGroup.reset();
  }
  }

  async save () {
    if(this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    };

    let command = new CreateReceiptItemCommand();
    command.invoiceId = this.form.invoiceId;
    command.invoiceNumber = this.form.invoiceNumber;
    command.deliveryReceiptNumber = this.form.deliveryReceiptNumber;
    command.invoiceDate = this.form.invoiceDate;
    command.deliveryReceiptId = this.form.id;
    command.docRef = "null";
    command.productId = this.formGroup.value.productId;
    command.productCode = this.formGroup.value.productCode;
    command.productName = this.formGroup.value.productName;
    command.expiryDate = this.formGroup.value.expiryDate;
    command.unitPrice = this.formGroup.value.unitPrice;
    command.salePrice = this.formGroup.value.salePrice;
    command.vendorBatchNumber = this.formGroup.value.vendorBatchNumber;
    command.internalBatchNumber = this.formGroup.value.internalBatchNumber;
    command.quantity = (this.formGroup.value.packing * this.formGroup.value.packingNumber) + this.formGroup.value.bulk ;
    command.pfs = this.formGroup.value.pfs;
    command.ppa = this.formGroup.value.ppa;
    command.packing = this.formGroup.value.packing;
    command.packingNumber = this.formGroup.value.packingNumber;
    command.bulk = this.formGroup.value.bulk;
    let totalAmount = await this.getLineTotalTTC(command);
    let taxTotalAmount = this.getTotalLineDiscount(command);
    command.totalAmount = this.form.totalAmount + totalAmount;
    command.taxTotalAmount = (this.form.totalAmount - this.form.totalAmountExlTax) + taxTotalAmount;
    command.receiptsAmountExcTax = command.totalAmount - command.taxTotalAmount;
    let findedRows = [];
    let product = this.rows.find(x => x.productId == command.productId); 
    if(this.rows.length > 0 )  findedRows = this.rows.filter(ele => ele.productId == command.productId && ele.internalBatchNumber == command.internalBatchNumber);
    
    if(findedRows.length == 0) {
      // Product  with the same internal batch Already exist 
      this.form.totalAmount =totalAmount;
      this.form.totalAmountExlTax = totalAmount - taxTotalAmount;
      this.addOrderItem(this.form.id,command).then(resp=> {
        this.notif.showNotification('mat-success','la ligne est ajoutée avec succès','top','right');
        this.dialogRef.close(command);
      }).catch(error=> {
        this.notif.showNotification('mat-success',error,'top','right');
      });
    } else  {
      if(command.quantity > ( product.remainingQuantity - product.quantity)){
        this.notif.showNotification('mat-warn','La quantité est supérieure à la quantité restante','top','right');
      }else{
      let quantity = 0 ;
      let packingNumber = 0 ;
      let vrac = 0 ;
      findedRows.forEach(element => {
        quantity+= element.quantity;
        packingNumber+= element.packingNumber;
        vrac+= element.bulk;

      });
      command.quantity+= quantity;
      command.packingNumber+= packingNumber;
      command.bulk+= vrac;
      let totalAmount = await this.getLineTotalTTC(command);
      let taxTotalAmount = this.getTotalLineDiscount(command);
      command.totalAmount = this.form.totalAmount + totalAmount;
      command.taxTotalAmount =
        this.form.totalAmount - this.form.totalAmountExcTax + taxTotalAmount;
      command.receiptsAmountExcTax =
        command.totalAmount - command.taxTotalAmount;
      this.form.totalAmount += totalAmount;
      this.form.totalAmountExlTax += totalAmount - taxTotalAmount;
      this.updateOrderItem(this.form.id,command).then(resp=> {
        this.notif.showNotification('mat-success','la ligne est ajoutée avec succès','top','right');
        this.dialogRef.close(command);
      }).catch(error=> {
        this.notif.showNotification('mat-success',error,'top','right');
      });
    }
  }
  }
  async addOrderItem  (id,command): Promise<any> {
     var result = await this.deliveryReceiptService.add(id,command).toPromise();
     return result;
  }
  async updateOrderItem  (id,command): Promise<any> {
    var result = await this.deliveryReceiptService.updateItem(id,command ).toPromise();
    return result;
 }
 async getLineTotalTTC(deliveryReceipt) {
 
  let invoiceItem =  this.products.find(ele => ele.productId == deliveryReceipt.productId &&  ele.internalBatchNumber == deliveryReceipt.internalBatchNumber);
    let tax = await this.productService.getTaxProduct(invoiceItem.productId).toPromise();
    let ht = this.calculHelper.getTotalHt(invoiceItem.purchaseUnitPrice, deliveryReceipt.quantity);
    let totalDiscount = this.calculHelper.getTotalDiscount(invoiceItem.discount * 100,0,ht);
    let totalTva = this.calculHelper.getTotalTva(tax,ht,totalDiscount);
    return ht - totalDiscount + totalTva;
}
getTotalLineDiscount(invoiceItem: any) {
  let ht = this.calculHelper.getTotalHt(invoiceItem.unitPrice, invoiceItem.quantity);
  if(invoiceItem.discount == null) invoiceItem.discount  = 0;
  return this.calculHelper.getTotalDiscount(invoiceItem.discount,0,ht)
}
}
