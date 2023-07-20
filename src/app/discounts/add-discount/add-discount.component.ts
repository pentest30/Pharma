import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { concat, Observable, of, Subject, throwError } from 'rxjs';
import { filter, distinctUntilChanged, debounceTime, tap, switchMap, catchError, map } from 'rxjs/operators';
import { Product } from 'src/app/product/prodcut-models/product';
import { DiscountService } from 'src/app/services/discount.service';
import { ProductService } from 'src/app/services/product.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { Discount } from '../discount-models/Discount';

@Component({
  selector: 'app-add-discount',
  templateUrl: './add-discount.component.html',
  styleUrls: ['./add-discount.component.sass']
})
export class AddDiscountComponent implements OnInit {

  public form: FormGroup;
  modalTitle: string;
  // products: any;
  products$: Observable<any>;
  productsLoading = false;
  productsInput$ = new Subject<string>();
  selectedMovie: any;
  minLengthTerm = 3;
  selectedProduct: any;
  constructor(public snackBar: MatSnackBar, 
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddDiscountComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private service: DiscountService,
    private productService: ProductService, 
    private notifHelper :NotificationHelper) { 

      if(data.id == null)
      this.modalTitle = "Créer";
      else this.modalTitle = "Modifier";
    }

  async ngOnInit(): Promise<void> {
    this.loadProducts();
    await this.createFrom();
    if(this.data.operation != 1 ) {
      this.selectedProduct = {
        id : this.data.element.productId, 
        fullName: this.data.element.productFullName, 
      }
      this.loadProducts();

      this.form.patchValue(this.data.element);
      this.form.patchValue({
        discountRate : this.data.element.discountRate * 100
      });
      console.log(this.form.value);

    }
  }
  
  onClientSelection(event) {
    
   if(event) this.form.get('productFullName').setValue(event.fullName);
  }
  save () {
    this.form.value.discountRate = this.form.value.discountRate / 100;

    if(this.form.invalid) return;
    if(this.form.value.id == null)
      this.add(this.form.value);
    else this.update(this.form.value);
  }
  update(value: Discount) {
    this.service.update(value).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "La modification est terminée avec succès", 'top', 'right');
      this.dialogRef.close(value);
    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
  add(value: Discount) {
    delete value.id;
    delete value.organizationId;
    this.service.add(value).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
      this.dialogRef.close(value);
    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
  close (){
    this.dialogRef.close();
  }
  private createFrom() {
    this.form = this.fb.group({
      id: [null, []],
      productId: [null, [Validators.required]],
      organizationId: [null, []],
      thresholdQuantity : [null , []],
      discountRate : [null , []],
      from : [null , []],
      to : [null, []],
      productFullName : [null, []]
    });
  }
  loadProducts() {
    let items = (this.selectedProduct != null) ? [this.selectedProduct] : []
    this.products$ = concat(
      of(items), // default items
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
      .getAllByName( term,null)
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
