import { Component, Directive, ElementRef, EventEmitter, HostListener, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

import { InventSumService } from 'src/app/services/inventory.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators/map'; 
import { UserService } from 'src/app/services/user.service';

import { InventSum } from '../models/inventsum-model';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/product/prodcut-models/product';
import {  DOWN_ARROW } from '@angular/cdk/keycodes';
import { MatDatepicker } from '@angular/material/datepicker';
import { DateHelper } from "src/app/shared/date-helper"
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';

@Component({
  selector: 'app-inventsum-add',
  templateUrl: './inventsum-add.component.html',
  styleUrls: ['./inventsum-add.component.sass']
})
export class InventSumAddComponent implements OnInit {
  @Output() notifyDataTabale = new EventEmitter();
  public viewmodel:InventSum;
  public productList:Product[];
  submitted = false;
  public form: FormGroup;
  public currentQty:number=0;
  public feed:boolean=false;
    constructor(public snackBar: MatSnackBar,
      private dateHelper:DateHelper,
    private fb: FormBuilder,
    private notif: NotificationHelper,
    private dialogRef: MatDialogRef<InventSumAddComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private dialog: MatDialog,
    private userService: UserService,
    private productService:ProductService,
    
    private service: InventSumService, private route: Router) {      
    if (data!={} && data != undefined && data.id != undefined) {
      this.viewmodel = data;
      console.log(data.feed);
      this.feed = data.feed;
    }
    else
    {
      this.viewmodel = new InventSum();
      this.viewmodel.isPublic=true;
    }
  }
  filteredProducts: Observable<Product[]>
  matautocomplete_product= new FormControl();
  ngOnInit(): void {  
    this.productService.getAll().
    subscribe(resp=>{      
      this.productList=resp; 
     
        }); 
    this.createForm(); 
    this.filteredProducts = this.matautocomplete_product.valueChanges
    .pipe(
      startWith(''),
      map(value => 
        this._filter(value))
    ); 
 
  }

  private _filter(value): Product[] {
    

    if (value == undefined || this.productList == undefined)
    {

       return [];
    }

     
    const filterValue = value.toLowerCase();
    var filterdList = this.productList.filter(option => 
      option.fullName.toLowerCase().includes(filterValue)
      ||option.code.toLowerCase().includes(filterValue));
      if(filterdList!=undefined && filterdList.length>0)      
      {
    this.viewmodel.productId =  filterdList[0].id;    
    this.viewmodel.salesUnitPrice=  filterdList[0].salePrice;
    this.viewmodel.purchaseUnitPrice= filterdList[0].purchasePrice;
      }
    return filterdList;
  }
  rewriteDate(value:string)
  {
    var date_regex = /^(0?[1-9]|1[0-2])\/\d{2}$/;
    if (date_regex.test(value)) {
      var month=value.substr(0,value.indexOf("/"));
      var year=value.substr(value.indexOf("/")+1)
      var date=new Date(month+"/1/20"+year);
      //To be re seen
        return this.viewmodel.expiryDate=this.dateHelper.addOffset(date);
    }
    
  }
  
  myFilter = (d: Date | null): boolean => {
    let test:boolean= d>new Date() ;
    return test
  } 
  save() {

    if(  this.form.value.purchaseUnitPrice!=null &&  this.form.value.salesUnitPrice!=null 
      && (  this.form.value.purchaseUnitPrice==0 ||  this.form.value.salesUnitPrice==0)){  
    const message = 'Le prix d\achat et de vente ne peuvent pas être nuls?\nVoulez vous continuer?';
    const dialogData = new ConfirmDialogModel("Confirmation", message); 
    const dialogRef = this.dialog.open(ConfimDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(!dialogResult)   return;
      if(  this.form.value.purchaseUnitPrice!=null &&  this.form.value.salesUnitPrice!=null 
        &&  this.form.value.purchaseUnitPrice>  this.form.value.salesUnitPrice){  
      const message2 = 'Le prix d\'achat est supérieur au prix de vente!\nVoulez vous continuer? ';
      const dialogData2 = new ConfirmDialogModel("Confirmation", message2); 
      const dialogRef2 = this.dialog.open(ConfimDialogComponent, {
        maxWidth: "400px",
        data: dialogData2
      });
   
      dialogRef2.afterClosed().subscribe(dialogResult => {
       if(!dialogResult)     return;
      if (this.form.invalid)
      return;
                  this.doSave();
    
       });
    }
  
    else{
        if (this.form.invalid)
        return;
              this.doSave();
    } 
    }
    );     
  }
  else
  {
    if(  this.form.value.purchaseUnitPrice!=null &&  this.form.value.salesUnitPrice!=null 
      &&  this.form.value.purchaseUnitPrice>  this.form.value.salesUnitPrice){  
    const message2 = 'Le prix d\'achat est supérieur au prix de vente!\nVoulez vous continuer? ';
    const dialogData2 = new ConfirmDialogModel("Confirmation", message2); 
    const dialogRef2 = this.dialog.open(ConfimDialogComponent, {
      maxWidth: "400px",
      data: dialogData2
    });
 
    dialogRef2.afterClosed().subscribe(dialogResult => {
     if(!dialogResult)     return;
    if (this.form.invalid)
    return;
                this.doSave();
  
     });
  }
  else
  {
      if (this.form.invalid)
      return;
      this.doSave();
  }
  }
} 
  doSave() {    
    // valider le formulaire principal 
    if (this.form.invalid) return;
    if (this.form.value.id === null) { 
      this.service.post(this.viewmodel).subscribe(msg => {
        this.notif.showNotification('mat-primary', "L'insertion du stock est terminée avec succès", 'top', 'right');
        this.dialogRef.close(this.form.value);
      }, (error) => { 
        if(!error.toLowerCase().startsWith("-erreur dimension"))
        this.notif.showNotification('mat-warn', error, 'top', 'right');
    else
   {
     let id2:string;
     this.service.getByDim(this.viewmodel).subscribe(resp=>
       {
         id2=resp.id;
         this.service.feed(id2,this.viewmodel).subscribe(msg => {
           this.dialogRef.close(this.form.value);
         }, (error) => {
           this.notif.showNotification('mat-warn', error, 'top', 'right');
         }
       );
   },
   (error) => {
     this.notif.showNotification('mat-warn', error, 'top', 'right');});       
       }
        
        return;
      });
    }
    else {
      if(this.feed)
      this.service.feed(this.viewmodel.id,this.viewmodel).subscribe(msg=>
        {
          this.notif.showNotification('mat-primary', "Le mouvement de stock est terminé avec succès", 'top', 'right');
          this.dialogRef.close(this.form.value);
        }, (error) => { this.notif.showNotification('mat-warn', error, 'top', 'right');});
        else
      this.service.update(this.viewmodel).subscribe(msg => {
        this.notif.showNotification('mat-primary', "La modification du stock est terminée avec succès", 'top', 'right');
        this.dialogRef.close(this.form.value);
      }, (error) => { 
        if(!error.toLowerCase().startsWith("-erreur dimension"))
        this.notif.showNotification('mat-warn', error, 'top', 'right');
 
    

          });
        }
        this.notifyDataTabale.emit(this.viewmodel);
        
  }

  close() {
    this.dialogRef.close();
  } 
  
  
  createForm() {
    this.form = this.fb.group({
      id:[this.viewmodel.id],
      productId:[this.viewmodel.productId], 
      physicalOnHandQuantity:[this.viewmodel.physicalOnhandQuantity],
      internalBatchNumber:[this.viewmodel.internalBatchNumber],
      vendorBatchNumber:[this.viewmodel.vendorBatchNumber],
      isPublic:[this.viewmodel.isPublic], 
      physicalOnhandQuantity:[this.viewmodel.physicalOnhandQuantity],
      physicalDispenseQuantity:[this.viewmodel.physicalDispenseQuantity],
      expiryDate:[this.viewmodel.expiryDate], 
      purchaseUnitPrice:[this.viewmodel.purchaseUnitPrice],
      purchaseDiscountRatio:[this.viewmodel.purchaseDiscountRatio],
      salesUnitPrice:[this.viewmodel.salesUnitPrice],
      salesDiscountRatio:[this.viewmodel.salesDiscountRatio],
      productFullName:[this.viewmodel.productFullName],
      packagingCode:[this.viewmodel.packagingCode], 
      packing:[this.viewmodel.packing], 
      pfs : [this.viewmodel.pfs], 
      ppaHT: [this.viewmodel.ppaHT], 
      ppaTTC:[this.viewmodel.ppaTTC], 
      ppaPFS : [this.viewmodel.ppaPFS]

    });
  }
} 


@Directive({
  selector: '[appTwoDigitDecimaNumber]'
})
export class TwoDigitDecimaNumberDirective {
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    console.log(this.el.nativeElement.value);
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}



