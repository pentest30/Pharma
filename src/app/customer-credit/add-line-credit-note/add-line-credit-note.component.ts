import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoiceItem } from 'src/app/billing/models/InvoiceItem';
import { AddProductDeliveryReceiptComponent } from 'src/app/procurment/add-product-delivery-receipt/add-product-delivery-receipt.component';
import { DeliveryReceiptService } from 'src/app/services/delivery-receipt.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';

@Component({
  selector: 'app-add-line-credit-note',
  templateUrl: './add-line-credit-note.component.html',
  styleUrls: ['./add-line-credit-note.component.sass']
})
export class AddLineCreditNoteComponent implements OnInit {
  products: InvoiceItem[] = [];
  invoice: any;
  quantity: any;
  public formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notif: NotificationHelper,
    private dialogRef: MatDialogRef<AddProductDeliveryReceiptComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) { 
    this.invoice = data.invoice;
  }

  async ngOnInit() {
    await this.createFrom();
  }
  createFrom() {
    this.formGroup =  this.fb.group({
      productId: [null, [Validators.required]],
      productName: [null, [Validators.required]],
      productCode: [null, [Validators.required]],
      quantity: [0, []],
      internalBatchNumber: [null, [Validators.required]],
      vendorBatchNumber: [null, [Validators.required]],
      unitPrice: [0, [Validators.required]],
      expiryDate: [null, [Validators.required]],
      pfs: [null, [Validators.required]],
      ppaHT: [null, [Validators.required]],
      ppaTTC: [null, [Validators.required]],

    });
  }
  async onProductSelection(selectedProduct) {
    if(selectedProduct != null){
      let product = this.invoice.invoiceItems.find(x => x.productId == selectedProduct.productId && x.internalBatchNumber == selectedProduct.internalBatchNumber && selectedProduct.vendorBatchNumber == x.vendorBatchNumber);   
     this.quantity =  product.quantity - product.returnedQty ;
      this.formGroup.patchValue(product);
      this.formGroup.controls.quantity.setValue(this.quantity);
    }
  }
  save() {
    this.dialogRef.close(this.formGroup.value);
  }
  close () {
    this.dialogRef.close();
  }
}
