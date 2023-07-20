import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { Product } from 'src/app/product/prodcut-models/product';
import { SupplierOrderService } from 'src/app/services/supplier-order.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { CreateSupplierOrderItem } from '../models/SupplierOrderItem';
import * as uuid from 'uuid';
import { MatButton } from '@angular/material/button';
import { concat, Observable, of, Subject, throwError } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { filter, distinctUntilChanged, debounceTime, tap, switchMap, catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-add-product-supplier-order',
  templateUrl: './add-product-supplier-order.component.html',
  styleUrls: ['./add-product-supplier-order.component.sass']
})
export class AddProductSupplierOrderComponent implements OnInit {
  products: any[] = [];
  supplierId: any;
  refDoc: any;
  isPsy: boolean;
  form: any;
  rows: any;
  cachedProduct: any;
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
  @ViewChild('quantity') quantityRef: ElementRef;
  @ViewChild('discount') discountRef: ElementRef;
  @ViewChild('unitPrice') purchaseUnitPriceRef: ElementRef;
  @ViewChild('saveButton') saveButtonRef: MatButton;

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
    private supplierOrderService: SupplierOrderService,
    private productService: ProductService,
    private dialogRef: MatDialogRef<AddProductSupplierOrderComponent>,
     @Inject(MAT_DIALOG_DATA) private data
    ) {
      this.products = [];
      this.products = this.data.products;
      this.form = this.data.form;
      this.isPsy = this.data.form.orderType == 1;
      this.refDoc =  this.data.form.refDocument;
      this.SupplierOrganizationId = this.data.currentSupplier.organizationId;
      this.supplierId = this.data.currentSupplier.id;

      this.rows = this.data.rows;
      //this.cachedProduct = JSON.parse(localStorage.getItem('products'));
 
    }
  async ngOnInit() {
    this.loadProducts();
    //this.cachedProduct = <any>  (await this.dbService.getAll("products")).shift();
    // if(this.rows.length >= 1) {
    //   let products = [];
    //   if(this.form.orderType == 0) products  = this.cachedProduct.filter(product => !product.psychotropic );    
    //   else products  = this.cachedProduct.filter(product => product.psychotropic);    
    //   this.products = products;
    // }
    await this.createFrom();

 
    this.formGroup.get("productId").valueChanges
      .subscribe(() => {
        this.productRef.focus();
    });
  }
  
  onQuantityKeyEnter() {
    if(this.formGroup.get('quantity').value != "" && this.formGroup.value.quantity > 0) 
    this.purchaseUnitPriceRef.nativeElement.focus();
  }
  onUnitPriceKeyEnter() {
    document.getElementById("minExpiryDate").focus();
  }
  onExpiryDateKeyEnter() {
    this.discountRef.nativeElement.focus();
  }
  onDiscountKeyEnter(event) {
    this.saveButtonRef.focus();
    this.save(event);
  }
  private async createFrom() {
    this.formGroup = await this.fb.group({
      orderType: [this.isPsy,[]],
      quantity: [null, [Validators.min(1),Validators.required,Validators.min(1)]],
      discount: [0, []],
      vendorBatchNumber: ['', []],
      productId: [null, [Validators.required]],
      productName: [null, [Validators.required]],
      productCode: [null, []],
      unitPrice: [0, [Validators.required]],
      expiryDate: [null, []],
      minExpiryDate: [null, []],


    });
  }
  async onCommandTypeSelection(commandType) {
    this.isPsy = (commandType.checked) ? true : false; 

    // let products  = [];
    // console.log(commandType);
    // if(commandType.checked) products  = this.cachedProduct.filter(product => product.psychotropic );
    // else products  = this.cachedProduct.filter(product => !product.psychotropic );
    // console.log(products);

    // this.products = products;
    this.formGroup.patchValue({
      productId:null,
      internalBatchNumber:null,
      quantity:null,
      extraDiscount:null,
      expiryDate:null,
      purchaseUnitPrice:null
    });
    this.form.psychotropic = commandType;
    this.productRef.focus();

  }
  close (){
    this.dialogRef.close(null);
  }

  onProductBlurSelection(event) {    
     if(this.formGroup.value.productId == null) this.productRef.focus();
  }
  public dataBoundEquivalence(e) {
    // here we are selecting the row after the refresh Complete
    this.grid2.selectRow(0);
  }
  async onProductSelection(selectedProduct) {
    this.isLoadingHistory = true;
    this.selectedProduct = selectedProduct;
    this.productId = selectedProduct.id;
    this.formGroup.get("productName").setValue(selectedProduct.fullName);
    this.formGroup.get("productId").setValue(selectedProduct.id);
    this.formGroup.get("productCode").setValue(selectedProduct.code);
    this.formGroup.get("unitPrice").setValue(selectedProduct.salePrice);
    this.quantityRef.nativeElement.focus();

    
    //return false;
  }
  resetProductList() {
    // this.products = JSON.parse(localStorage.getItem('products'));
  }
  // customProductSearchFn (term:string , item : any) {
  //   if(term!=undefined) {
  //     term = term.toLocaleLowerCase();
  //     let part1 = term.split(" ")[0];
  //     let part2 = term.split(" ")[1];
  //     if(part2 && item.fullName) {
  //       return      ( item.fullName.toLocaleLowerCase().indexOf(part1) > -1 && item.fullName.toLocaleLowerCase().indexOf(part2) > -1) ;
 
  //     }
  //      return  (item.code != undefined && item.code.toLocaleLowerCase().indexOf(term) > -1 )  
  //      || (item.manufacturer != undefined && item.manufacturer.toLocaleLowerCase().indexOf(term) > -1 ) 
  //      || ( (item.fullName) ? item.fullName.toLocaleLowerCase().indexOf(part1) > -1 : true ) ;
  //   }
  // }
  // onProductSearch(event) {
  //   let products  = [];
  //   let psy = (this.rows.length == 0) ? (this.formGroup.value.orderType ? 1 : 0) : this.form.orderType;
  //   if(this.cachedProduct.length) {
  //     if(psy == 1) products  = this.cachedProduct.filter(product => product.psychotropic );
  //     else products  = this.cachedProduct.filter(product => !product.psychotropic );
  //     if(event.term == "") this.products = products    ;
  //   }
  // }

  async save (event) {
    if(this.formGroup.invalid ) return;
    if(event.pointerType != 'mouse' && (this.formGroup.controls["minExpiryDate"].touched == false || this.formGroup.controls["discount"].touched == false )) return;
    let command = new CreateSupplierOrderItem();
    command.orderId = this.form.id;
    command.documentRef = this.form.refDocument;
    command.customerName = '';
    command.supplierName = this.form.supplierName;

    command.productId = this.formGroup.value.productId;
    command.productCode = this.formGroup.value.productCode;
    command.productName = this.formGroup.value.productName;
    command.expiryDate = this.formGroup.value.expiryDate;
    command.minExpiryDate = this.formGroup.value.minExpiryDate;
    command.unitPrice = this.formGroup.value.unitPrice;
    command.discount = this.formGroup.value.discount;
    command.vendorBatchNumber = this.formGroup.value.vendorBatchNumber;
    command.expectedDeliveryDate = this.form.expectedDeliveryDate;
    command.internalBatchNumber = '';
    command.id = uuid.v4();
    command.quantity = this.formGroup.value.quantity;
    command.supplierOrganizationId = this.SupplierOrganizationId;
    command.psychotropic = this.formGroup.value.orderType;
    let row = this.rows.filter(ele => ele.productId == command.productId);
    if(row.length == 0) {
     this.addOrderItem(this.form.id,command).then(resp=> {
      this.notif.showNotification('mat-success','la ligne est réservé avec succès','top','right');
      this.selectedProduct = null;
      this.dialogRef.close(this.formGroup.value);
     }).catch(error=> {
      this.notif.showNotification('mat-success',error,'top','right');
     });
    

    } else  {
      
    }

  }
  async addOrderItem  (id,command): Promise<any> {
     var result = await this.supplierOrderService.createSupplierOrderItem(id,command ).toPromise();
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
