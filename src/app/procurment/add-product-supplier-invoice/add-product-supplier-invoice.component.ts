import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgSelectComponent } from '@ng-select/ng-select';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { concat, Observable, of, Subject, throwError } from 'rxjs';
import { filter, distinctUntilChanged, debounceTime, tap, switchMap, catchError, map } from 'rxjs/operators';
import { Product } from 'src/app/product/prodcut-models/product';
import { PickingZoneService } from 'src/app/services/piking-zone.service';
import { ProductService } from 'src/app/services/product.service';
import { SupplierInvoiceService } from 'src/app/services/supplier-invoice.service';
import { CalculMethodHelper } from 'src/app/shared/CalculMethodHelper';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { GetInternalBnInvoiceQuery } from '../models/SupplierInvoice';
import { CreateInvoiceItemCommand } from '../models/SupplierInvoiceItem';
@Component({
  selector: 'app-add-product-supplier-invoice',
  templateUrl: './add-product-supplier-invoice.component.html',
  styleUrls: ['./add-product-supplier-invoice.component.sass']
})
export class AddProductSupplierInvoiceComponent implements OnInit {

  products: any[] = [];
  supplierId: any;
  refDoc: any;
  isPsy: boolean;
  form: any;
  rows: any;
  public formGroup: FormGroup;
  @ViewChild("productId") productRef: NgSelectComponent;
  productId: any;
  selectedProduct: any;
  isLoadingHistory: boolean;
  equivalences: any[] = [];
  equivalenceOn: boolean;
  equivalenceProduct: any;
  selectedTab: number = 0;
  scrolledProduct: Product;
  @ViewChild('grid2') public grid2: GridComponent;
  SupplierOrganizationId: any;
  zones: any = [];
  errorMessages: string;
  error: boolean = false;
  @ViewChild('internalVendorRef') internalVendorRef: ElementRef;
  @ViewChild('quantity') quantityRef: ElementRef;
  @ViewChild('packing') packingRef: ElementRef;
  @ViewChild('unitPrice') purchaseUnitPriceRef: ElementRef;
  @ViewChild('salePrice') salePriceRef: ElementRef;
  @ViewChild('pfs') pfsRef: ElementRef;
  @ViewChild('ppaHt') ppaRef: ElementRef;
  @ViewChild('discount') discountRef: ElementRef;
  @ViewChild('expiryDate') expiryDateRef: ElementRef;
  batches: any;
  products$: Observable<any>;
  productsLoading = false;
  productsInput$ = new Subject<string>();
  selectedMovie: any;
  minLengthTerm = 3;
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
    private supplierInvoiceService: SupplierInvoiceService,
    private zoneService: PickingZoneService,
    private calculMethodHelper: CalculMethodHelper,
    private dialogRef: MatDialogRef<AddProductSupplierInvoiceComponent>,
    private productService: ProductService,
     @Inject(MAT_DIALOG_DATA) private data
    ) {
      this.products = [];
      this.products = this.data.products;
      // Form value entete invoice
      this.form = this.data.form;
      this.isPsy = this.data.form.orderType == 1;
      this.refDoc =  this.data.form.refDocument;
      this.SupplierOrganizationId = this.data.currentSupplier.organizationId;
      this.rows = this.data.rows;

    }
  async ngOnInit() {
    await this.createFrom();
    this.formGroup.get("productId").valueChanges
      .subscribe(() => {
        this.productRef.focus();
    });
    this.getAllZones();
  }
  async getAllZones() {
    this.zones = await this.zoneService.getAll().toPromise();
  }


  async onVendorBatchChange(batchValue) {
    let command = new GetInternalBnInvoiceQuery();
    command.productId = this.selectedProduct.id;
    command.supplierId = this.form.supplierId;
    command.vendorBatchNumber = batchValue;

  }

  onVendorBatchKeyEnter() {
    if(this.formGroup.value.vendorBatchNumber != '' && this.formGroup.value.vendorBatchNumber != null)
    this.packingRef.nativeElement.focus();

  }
  onPackingKeyEnter() {
    if(this.formGroup.value.packing != '' && this.formGroup.value.packing != null)
    this.quantityRef.nativeElement.focus();
  }
  onQuantityKeyEnter() {
    if(this.formGroup.value.quantity != '' && this.formGroup.value.quantity != null)
    this.purchaseUnitPriceRef.nativeElement.focus();
  }
  onPurchasePriceKeyEnter() {
    document.getElementById("expiryDate").focus();
  }
  onExpiryDateKeyEnter() {
    this.discountRef.nativeElement.focus();
  }
  onDiscountKeyEnter() {
    if(this.formGroup.value.discount != '' && this.formGroup.value.discount != null)
    this.salePriceRef.nativeElement.focus();
  }
  onSalePriceKeyEnter() {
    if(this.formGroup.value.salePrice != '' && this.formGroup.value.salePrice != null)
    this.pfsRef.nativeElement.focus();
  }
  onPfsKeyEnter() {
    this.ppaRef.nativeElement.focus();
  }
  //Form creation
  private async createFrom() {
    this.formGroup = await this.fb.group({
      productId: [null, [Validators.required]],
      productName: [null, [Validators.required]],
      productCode: [null, [Validators.required]],
      quantity: [null, [Validators.min(1),Validators.required,Validators.min(1)]],
     // internalBatchNumber: [null, [Validators.required]],
      discount: [0, []],
      vendorBatchNumber: [null, [Validators.required]],
      purchaseUnitPrice: [0, [Validators.required]],
      purchasePriceIncDiscount: [0, [Validators.required]],
      salePrice: [null, [Validators.required, this.ValidateSalePrice.bind(this)]],
      expiryDate: [null, [Validators.required, this.ValidateExpiryDate.bind(this)]],
      totalAmount: [0, []],
      receiptsAmount: [0, []],
      pfs: [null, [Validators.required, this.ValidateSHP.bind(this)]],
      ppaHt: [null, [Validators.required]],
      ppaTTC: [null, []],
      ppaPFS: [null, []],
      ug : [0,[]],
      wholesaleMargin: [0, []],
      pharmacistMargin: [0, []],
      packing: [null, [Validators.required]],
      pickingZoneId: [null, []],
      pickingZoneName: ['',[]],
    });
  }
  ValidateSalePrice(control: AbstractControl): {[key: string]: any} | null  {

    if (control.value && control.value < this.formGroup.value.purchaseUnitPrice) {
      return { 'SalePriceInvalid': true };
    }
    return null;
  }
  ValidateExpiryDate(control: AbstractControl): {[key: string]: any} | null  {
    if (control.value && control.value <= new Date()) {
      return { 'ExpiryDateInvalid': true };
    }
    return
    null;
  }
  ValidateSHP(control: AbstractControl): {[key: string]: any} | null  {
    if (control.value && (control.value < 0 || control.value > 2.5)) {
      return { 'InvalidSHP': true };
    }
    return
    null;
  }
  close (){
    this.dialogRef.close(null);
  }
  customProductSearchFn (term:string , item : any) {
    if(term!=undefined) {
      term = term.toLocaleLowerCase();
      let part1 = term.split(" ")[0];
      let part2 = term.split(" ")[1];
      if(part2 && item.fullName) {
        return      ( item.fullName.toLocaleLowerCase().indexOf(part1) > -1 && item.fullName.toLocaleLowerCase().indexOf(part2) > -1) ;

      }
       return  (item.code != undefined && item.code.toLocaleLowerCase().indexOf(term) > -1 )
       || (item.manufacturer != undefined && item.manufacturer.toLocaleLowerCase().indexOf(term) > -1 )
       || ( (item.fullName) ? item.fullName.toLocaleLowerCase().indexOf(part1) > -1 : true ) ;
    }
  }
  onProductBlurSelection(event) {
     if(this.formGroup.value.productId == null) this.productRef.focus();
  }

  async onProductSelection(selectedProduct) {
    this.error = false;
    let existInOrder = this.data.supplierOrder.orderItems.filter( item => item.productId == selectedProduct.id);
    if(existInOrder.length == 0) {
      this.error = true;
      this.errorMessages = "Le produit selectionnée n'existe pas dans le bon de commande";
      setTimeout(function () {
        this.error = false;
        this.errorMessages = "";
        let element =  document.getElementById('closeNotif');
        if (element != null) element.click();
      }, 2000);
    }
    this.isLoadingHistory = true;
    this.selectedProduct = selectedProduct;
    this.productId = selectedProduct.id;
    this.formGroup.get("productName").setValue(selectedProduct.fullName);
    this.formGroup.get("productId").setValue(selectedProduct.id);
    this.formGroup.get("productCode").setValue(selectedProduct.code);
    this.formGroup.get("pfs").setValue(selectedProduct.pfs);
    //this.formGroup.get("shp").setValue(selectedProduct.shp);
    let zone = this.zones.find(z => z.id == selectedProduct.pickingZoneId);
    this.formGroup.get('pickingZoneId').setValue((zone == null ||zone == undefined) ? this.zones.shift().id : selectedProduct.pickingZoneId);
    this.formGroup.get('pickingZoneName').setValue((zone == null ||zone == undefined ) ? " " : zone.name);
    this.internalVendorRef.nativeElement.focus();
    return false;
  }
  onQuantityChange(quantity) {
    this.error = false;
    let totalQuantity = quantity;
    let existInOrder = this.data.supplierOrder.orderItems.find( item => item.productId == this.selectedProduct.id);
    if(existInOrder != null) {
      this.data.rows.forEach(element => {
        if(element.vendorBatchNumber == this.formGroup.value.vendorBatchNumber && element.productId == this.formGroup.value.productId) {
          totalQuantity+= element.quantity;
        }
      });
      if(totalQuantity > existInOrder.quantity) {
        this.error = true;
        this.errorMessages = "La quantité selectionnée est superieur a la quantité commandé";
      }
    }
    let discount = this.formGroup.value.discount;
    let rateUg = this.calculMethodHelper.calulTauxUg(discount /100) ;
    let ug = this.calculMethodHelper.calculUg(quantity,rateUg);
    this.formGroup.get('ug').setValue(ug.toFixed(1));
  }
  onPurchaseUnitPriceChange() {
    let purchaseUnitPrice = this.formGroup.value.purchaseUnitPrice;
    let discount = this.formGroup.value.discount;
    let purchasePriceIncDiscount = this.calculMethodHelper.getDiscountPurchasePrice(purchaseUnitPrice,discount /100);
    this.formGroup.get('purchasePriceIncDiscount').setValue(purchasePriceIncDiscount);
    this.formGroup.updateValueAndValidity({emitEvent: true,onlySelf:true});
    let wholesaleMargin = this.calculMethodHelper.calculWholesaleMargin(this.formGroup.get('purchasePriceIncDiscount').value, this.formGroup.get('salePrice').value) * 100;
    this.formGroup.get('wholesaleMargin').setValue(wholesaleMargin.toFixed(2));
  }
  onDiscountChange() {
    let purchaseUnitPrice = this.formGroup.value.purchaseUnitPrice;
    let discount = this.formGroup.value.discount;
    let quantity = this.formGroup.value.quantity;
    let purchasePriceIncDiscount = this.calculMethodHelper.getDiscountPurchasePrice(purchaseUnitPrice,discount / 100);
    let rateUg = this.calculMethodHelper.calulTauxUg(discount /100) ;
    let ug = this.calculMethodHelper.calculUg(quantity,rateUg);
    this.formGroup.get('ug').setValue(ug.toFixed(1));
    this.formGroup.get('purchasePriceIncDiscount').setValue(purchasePriceIncDiscount);
    this.formGroup.updateValueAndValidity({emitEvent: true,onlySelf:true});

  }
  onPpaHtChange(ppaHt) {
    let salePrice = 0;
    let ppaTTC = this.calculMethodHelper.calculPpaTTC(this.selectedProduct.tax, ppaHt);
    let ppaPFS = ppaTTC + this.formGroup.value.pfs;
    if(ppaHt <= 70){
       salePrice = (ppaHt * 50) /100 ;
    }else if(ppaHt > 70 && ppaHt <= 110){
      salePrice = (ppaHt * 33) / 100;
    }else if(ppaHt > 110 && ppaHt <= 150){
      salePrice = (ppaHt * 25) / 100;
    }else if(ppaHt > 150){
      salePrice = (ppaHt * 20 ) / 100;
    }
    this.formGroup.get('ppaTTC').setValue(ppaTTC);
    this.formGroup.get('ppaPFS').setValue(ppaPFS);
    this.formGroup.get('salePrice').setValue(salePrice);
    let wholesaleMargin = this.calculMethodHelper.calculWholesaleMargin(this.formGroup.get('purchasePriceIncDiscount').value, this.formGroup.get('salePrice').value) * 100;
    let PharmacistMargin = this.calculMethodHelper.calculPharmacistMargin(ppaHt, this.formGroup.get('salePrice').value) * 100;
    this.formGroup.get('wholesaleMargin').setValue(wholesaleMargin.toFixed(2));
    this.formGroup.get('pharmacistMargin').setValue(PharmacistMargin.toFixed(2));
    this.formGroup.updateValueAndValidity({emitEvent: true,onlySelf:true});
  }

  onChangePfs(pfs) {
    let ppaPFS = pfs + this.formGroup.value.ppaTTC;
    this.formGroup.get('ppaPFS').setValue(ppaPFS);
    this.formGroup.updateValueAndValidity({emitEvent: true,onlySelf:true});
  }
  
  async resetProductList() {
    this.equivalenceOn = false;
    this.equivalenceProduct = null;
  }
  onTabChanged($event) {
    let clickedIndex = $event.index;
    if(this.selectedTab != clickedIndex) this.selectedTab = clickedIndex;
    if(clickedIndex == 0) {
      let rows = this.rows;
      this.rows = [...rows];
    }
  }

  async save (event) {
    if(this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    };
    let totalLineHT = this.formGroup.value.purchaseUnitPrice * this.formGroup.value.quantity ;
    let totalLineDiscount = (totalLineHT * this.formGroup.value.discount / 100) ;
    let totalLineTTC = totalLineHT - totalLineDiscount + (this.selectedProduct.tax  * (totalLineHT - totalLineDiscount));
    let totalTTC = this.data.totoalTTC + totalLineTTC;
    if (totalTTC > this.form.totalAmount) {
      this.error = true;
      this.errorMessages = "Le Total TTC Facturé est depassé";
      return;
    }
    let command = new CreateInvoiceItemCommand();
    command.invoiceId = this.form.id;
    command.orderId = this.form.orderId;
    command.documentRef = this.form.refDocument;
    command.productId = this.formGroup.value.productId;
    command.productCode = this.formGroup.value.productCode;
    command.productName = this.formGroup.value.productName;
    command.expiryDate = this.formGroup.value.expiryDate;
    command.minExpiryDate = this.formGroup.value.minExpiryDate;
    command.purchaseUnitPrice = this.formGroup.value.purchaseUnitPrice;
    command.purchasePriceIncDiscount = this.formGroup.value.purchasePriceIncDiscount;
    command.salePrice = this.formGroup.value.salePrice;
    command.discount = this.formGroup.value.discount / 100;
    command.vendorBatchNumber = this.formGroup.value.vendorBatchNumber;
    command.internalBatchNumber = "";
    command.quantity = this.formGroup.value.quantity;
    command.supplierOrganizationId = this.form.supplierId;
    command.supplierId = this.form.supplierId;
    command.supplierName = this.form.supplierName;
    command.invoiceDate = this.form.invoiceDate;
    command.packing = this.formGroup.value.packing;
    command.wholesaleMargin = parseFloat(this.formGroup.value.wholesaleMargin) /100 ;
    command.pharmacistMargin = parseFloat(this.formGroup.value.pharmacistMargin) / 100 ;
    command.pfs = this.formGroup.value.pfs;
    command.ppaHT = this.formGroup.value.ppaHt;
    command.ppaTTC = this.formGroup.value.ppaTTC;
    command.ppaPFS = this.formGroup.value.ppaPFS;
    command.totalAmount = this.form.totalAmount;
    command.totalAmountExlTax = this.form.totalAmountExlTax;
    command.color = '';
    command.size = '';
    command.invoiceNumber = '';
    command.pickingZoneName = this.formGroup.value.pickingZoneName;
    command.pickingZoneId = this.formGroup.value.pickingZoneId;
    command.packagingCode = ' ';
    command.psychotropic = this.formGroup.value.psychotropic;

    this.addOrderItem(this.form.id,command).then(resp=> {
      if(resp.validationResult && resp.validationResult.isValid == false) {
        this.notif.showNotification('mat-success',resp.validationResult.errors[0].errorMessage,'top','right');
        this.dialogRef.close(null);
      } else {
        this.notif.showNotification('mat-success','la ligne est ajoutée avec succès','top','right');
        this.selectedProduct = null;
        command.internalBatchNumber = resp.internalBatch;
        command.discount = command.discount * 100;
        this.dialogRef.close(command);
      }
    }).catch(error=> {
      this.notif.showNotification('mat-success',error,'top','right');
    });
  }

  async addOrderItem  (id,command): Promise<any> {
     var result = await this.supplierInvoiceService.createSupplierInvoiceItem(id,command ).toPromise();
     return result;
  }
  loadProducts() {
    this.products$ = concat(
      of([]), // default items
      this.productsInput$.pipe(
        filter(res => {
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
}


