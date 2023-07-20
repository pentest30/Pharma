import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommandClickEventArgs, GridComponent, KeyboardEventArgs } from '@syncfusion/ej2-angular-grids';
import { loadCldr, setCulture } from '@syncfusion/ej2-base';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { DeliveryReceipt } from '../models/DeliveryReceipt';
import { SupplierInvoice } from '../models/SupplierInvoice';
import * as uuid from 'uuid';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { CreateReceiptItemCommand } from '../models/DeliveryReceiptItem';
import { DeliveryReceiptService } from 'src/app/services/delivery-receipt.service';
import { AddProductDeliveryReceiptComponent } from '../add-product-delivery-receipt/add-product-delivery-receipt.component';
import { DialogHelper } from 'src/app/shared/DialogHelper';
import { CalculMethodHelper } from 'src/app/shared/CalculMethodHelper';
import { DetailDeliveryReceiptComponent } from '../detail-delivery-receipt/detail-delivery-receipt.component';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-delivery-receipt',
  templateUrl: './add-delivery-receipt.component.html',
  styleUrls: ['./add-delivery-receipt.component.sass']
})
export class AddDeliveryReceiptComponent implements OnInit {

  public form: FormGroup;  
  navigation: any;
  gridLines: string;
  toolbarItems: ({ text: string; tooltipText: string; id: string; cssClass?: undefined; } | { text: string; tooltipText: string; id: string; cssClass: string; })[];
  editOptions: { allowEditing: boolean; allowAdding: boolean; allowDeleting: boolean; mode: string; };
  commands: { type: string; buttonOption: { iconCss: string; cssClass: string; }; }[];
  supplierId: any;
  supplier: any;
  selectedSupplier: any;
  suppliers: any[] = [];
  currentSupplier: any;
  isPsy: boolean;
  cachedProduct: any[] = [];
  products: any[] = [];
  rows: any[] = [];
  selected: any[] = [];
  dialogOpend: any;
  @ViewChild('batchgrid') public grid: GridComponent;
  supplierInvoice: SupplierInvoice;
  quantityRules: { required: any[]; };
  exceededQuantityRules :{required : any[]};
  AmountTTCRules: { required: any[]; };
  @ViewChild('refDocument') refDocumentRef: ElementRef;
  @ViewChild('totalAmount') totalAmountRef: ElementRef;
  @ViewChild('totalAmountExcTax') totalAmountExcTaxRef: ElementRef;
  isItemsAlreadyCreated: boolean = false;
  deliveryReceipt: DeliveryReceipt = null;
  setFocus: any;
  totalAmountExlTax: any;
  isOpen: any;
  ecartTTC: number = 0;
  totalhtdiscounted: number = 0;
  totalHt: number = 0;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(!this.dialogOpend) {
      switch (event.key) {
        case "-":
          event.preventDefault();
          let orderItem = this.rows[this.grid.selectedRowIndex];
          this.deleteDeliveryReceiptItem(orderItem);
          break;
        case "F2":
          event.preventDefault();
          this.save();
          break;
        case "F3":
          event.preventDefault();
          this.addProductLine();
          break;

        case "F4":
          event.preventDefault();
          break;

        case "F5":
          event.preventDefault();
          //this.cancelOrder();
          break;
        case "F6":
          event.preventDefault();
          break;
        case "F9":
          var ele = document
            .getElementsByClassName("e-filtertext")
            .namedItem("productName_filterBarcell");
          setTimeout(() => (ele as HTMLElement).focus(), 0);
          break;

        case "F8":
          event.preventDefault();
          this.view(this.deliveryReceipt)
          break;
        case "+":
          event.preventDefault();
          this.addProductLine();
          break;
        // case "Enter":
        //   break;
        default:
          break;
      }
    }
   
  }
 
  constructor( 
    private fb: FormBuilder,
    private notif: NotificationHelper,
    private dialogHelper: DialogHelper,
    private route: Router,
    private deliveryReceiptService: DeliveryReceiptService,
    private calculHelper: CalculMethodHelper,
    private productService: ProductService,
    private dialog: MatDialog) {

      this.navigation = route.getCurrentNavigation();
      setCulture('fr');
      loadCldr(require('./../../sales/numbers.json'));

    }

  async ngOnInit() {
    this.gridLines = 'Both';
    this.quantityRules = {required:[this.customNegativeValueValidationFn,"Valeur min  0"]};
    this.exceededQuantityRules = {required :[this.customQuantityValidationFn, "Quantité Facture dépassée"]}
    this.toolbarItems = [
      { text: 'Ajouter Article (F3 / +)', tooltipText: 'Ajouter un Article', id: 'addarticle' },
      { text: 'Supprimer Article (-)', tooltipText: 'Sauvgarder la commande', id: 'deletearticle' },
      { text: 'Filtrer (F9)', tooltipText: 'Sauvgarder la commande',  id: 'filter' },
      { text: 'Sauvgarder (F2)', tooltipText: 'Sauvgarder la commande', id: 'saveorder' },
      // { text: 'Annuler (F5)', tooltipText: 'Annuler',  id: 'cancelorder' },
      { text: 'Visualiser (F8)', tooltipText: 'Visualiser', id: 'viewlines' , cssClass:'e-info'},

    ];
  
    this.editOptions = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
    
    this.commands = [
      { type: 'None', buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat'} },
    ];
  
    if(this.navigation.extras.state == undefined) this.route.navigate(['/procurment/delivery-receipt-list/']);
    else {
      this.supplierInvoice =  JSON.parse(this.navigation.extras.state.supplierInvoice);
    }
   
    await this.createForm();

    if(this.navigation.extras.state.supplierInvoice != null && this.navigation.extras.state.deliveryReceipt == null) {
      let invoice = <SupplierInvoice> JSON.parse( this.navigation.extras.state.supplierInvoice);
      this.rows = <any[]>invoice.items;
      this.rows.map(ele => {
        let remainingQuantity = invoice.items.find(item => ele.productId == item.productId && ele.internalBatchNumber == item.internalBatchNumber).remainingQuantity;
        ele.ppa = ele.ppaHT;
        ele.packingNumber = (remainingQuantity == 0 || ele.packing == 0 ) ? 0 :  Math.floor(remainingQuantity / ele.packing);
        ele.bulk = (remainingQuantity == 0 || ele.packing == 0) ? remainingQuantity : remainingQuantity % ele.packing;
        ele.quantity = remainingQuantity;
        ele.id = uuid.v4();
        ele.unitPrice = ele.purchaseUnitPrice;
        return ele;
      });
      this.rows = this.rows.filter(c => c.quantity != 0);
    }
    // case edition delivery receipt
    if(this.navigation.extras.state.deliveryReceipt != null) {
      this.deliveryReceipt =  JSON.parse(this.navigation.extras.state.deliveryReceipt);
      this.form.patchValue({
        id: this.deliveryReceipt.id,
        docRef : this.deliveryReceipt.docRef,
        deliveryReceiptDate: this.deliveryReceipt.deliveryReceiptDate,
      });
      this.form.get('totalAmountExlTax').setValue(this.deliveryReceipt.receiptsAmountExcTax);
      this.form.get('totalAmount').setValue(this.deliveryReceipt.totalAmount);
      this.rows = this.deliveryReceipt.items;
      this.rows.map(ele => {
        ele.unitPrice = ele.unitPrice;
        ele.purchaseUnitPrice = ele.unitPrice;
        return ele;
      });     
    } else {    
        if(!this.isItemsAlreadyCreated) {
          for (let index = 0; index < this.rows.length; index++) {
            let element = this.rows[index];
            let item = new CreateReceiptItemCommand();
            item.id = element.id;
            item.invoiceDate = this.form.value.invoiceDate;
            item.deliveryReceiptId = this.form.value.id;
            item.deliveryReceiptDate = this.form.value.deliveryReceiptDate;
            item.deliveryReceiptNumber = this.form.value.deliveryReceiptNumber;
            item.docRef = this.form.value.docRef;
            item.expiryDate = element.expiryDate;
            item.invoiceId = this.form.value.invoiceId;
            item.invoiceNumber = this.form.value.invoiceNumber;
            item.organizationId = this.form.value.organizationId;
            item.internalBatchNumber = element.internalBatchNumber;
            item.vendorBatchNumber = element.vendorBatchNumber;
            item.productCode = element.productCode;
            item.productId = element.productId;
            item.productName = element.productName;
            item.quantity = element.quantity;
            item.salePrice = element.salePrice;
            item.unitPrice = element.purchaseUnitPrice;
            item.purchaseUnitPrice = element.purchaseUnitPrice;
            item.pfs = element.pfs;
            item.ppa = element.ppaHT;
            item.packing = element.packing;
            item.totalAmount = this.getTotalTTCCart();
            item.taxTotalAmount = this.getTotalTVACart();
            item.discountTotalAmount = this.getTotalDiscountCart();

            item.packingNumber = ( element.packing != 0) ? Math.floor(element.quantity / element.packing) : 0;
            item.bulk = (element.packing != 0)  ? element.quantity % element.packing : element.quantity;
            await this.deliveryReceiptService.add(item.deliveryReceiptId,item).toPromise();
            
          }
          this.deliveryReceipt = new DeliveryReceipt();
          this.deliveryReceipt.id = this.form.value.id;
          this.deliveryReceipt.invoiceId = this.form.value.invoiceId;
          this.deliveryReceipt.invoiceDate = this.form.value.invoiceDate;
          this.deliveryReceipt.invoiceNumber = this.form.value.invoiceNumber;
          this.deliveryReceipt.docRef = this.form.value.docRef;
          this.deliveryReceipt.totalAmount = this.form.value.totalAmount;
          this.deliveryReceipt.receiptsAmountExcTax = this.form.value.totalAmountExlTax;
          this.deliveryReceipt.taxTotalAmount = this.form.value.totalAmount - this.form.value.totalAmountExlTax;
          this.deliveryReceipt.deliveryReceiptDate = this.form.value.deliveryReceiptDate;
          this.deliveryReceipt.deliveryReceiptNumber = this.form.value.deliveryReceiptNumber;

          this.isItemsAlreadyCreated = true;
          this.rows = [...this.rows];
          this.deliveryReceipt.items = this.rows;

        } 

    }
    this.getTotalTTCCart();
  }
  async view(deliveryReceipt) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { 
      deliveryReceipt: deliveryReceipt
    };
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';
    if(!this.isOpen)  {
      var modalRef = this.dialog.open(DetailDeliveryReceiptComponent, dialogConfig);
      this.isOpen = true;
      modalRef.afterClosed().subscribe(res => {
        this.isOpen = false;

      });
    }
  }
  createForm() {
    let refDocument ;
    if(this.supplierInvoice &&  (this.supplierInvoice.refDocument == "" || this.supplierInvoice.refDocument == " ")) refDocument = "null"
    else refDocument = this.supplierInvoice.refDocument
    this.form = this.fb.group({
      id: [uuid.v4(), []],
      invoiceDate: [(this.supplierInvoice) ? this.supplierInvoice.invoiceDate : null, [Validators.required]],
      deliveryReceiptDate: [new Date(), [Validators.required]],
      docRef : ["null", []],
      deliveryReceiptNumber : ["null", []],
      invoiceId : [(this.supplierInvoice) ? this.supplierInvoice.id : null, [Validators.required]],
      invoiceNumber : [refDocument, []],
      totalAmount : [(this.supplierInvoice) ? this.supplierInvoice.totalAmount : null, [Validators.required]],
      totalAmountExlTax : [(this.supplierInvoice) ?  this.supplierInvoice.totalAmountExlTax : null, [Validators.required]],

    });
  }
  public dataBound(e) {
    this.grid.selectRow(0);
  }
  load(args){
    document.getElementsByClassName('e-grid')[0].addEventListener('keydown', this.keyDownHandler.bind(this));
    
    
    this.grid.element.addEventListener('keypress', (e: KeyboardEventArgs) => {
      if(e.key == '*') {
        e.preventDefault();

        if ((e.target as HTMLElement).classList.contains("e-rowcell")) {

          if (this.grid.isEdit)
              this.grid.endEdit();
             
              let index: number = parseInt((e.target as HTMLElement).getAttribute("Index"));
              let colindex: number = parseInt((e.target as HTMLElement).getAttribute("aria-colindex"));
              let field: string = this.grid.getColumns()[colindex].field;
              let columns = <any[]>this.grid.columns;
          
              this.grid.selectRow(index);
              this.grid.startEdit();

              let focusColumns = columns.find(c => c.field == field);
              focusColumns.edit.obj.element.focus();
        };
      }
    });

  }
  keyDownHandler(e: KeyboardEventArgs) { 
    if (e.key === 'F2') {
          e.preventDefault();
          this.grid.endEdit();
          e.cancel = true;
    }
  }
  preview(invoice: SupplierInvoice) {
    throw new Error('Method not implemented.');
  }
  filter() {
    throw new Error('Method not implemented.');
  }
  clickHandler(args: ClickEventArgs): void {
    switch (args.item.id) {
      case 'addarticle':
        this.addProductLine();
        break;
      case 'deletearticle':
        let orderItem = this.rows[this.grid.selectedRowIndex];
        this.deleteDeliveryReceiptItem(orderItem);
        break;
      case 'filter':
        this.filter();
        break;
      case 'saveorder':
        this.save();
        break;
      case 'viewlines':
       this.view(this.deliveryReceipt);
        break;
      default:
        break;
    }

  }
 
  commandClick(args: CommandClickEventArgs): void {
    this.deleteDeliveryReceiptItem(args.rowData)
  }
  getIndexRow(index) {
    return this.grid.getRowIndexByPrimaryKey(index) + 1;
  }
  created(){
  } 
  actionComplete(args) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      this.setFocus.edit.obj.element.focus();
    }
    if ((args.requestType === 'save')) {
      let invoice = <SupplierInvoice> JSON.parse( this.navigation.extras.state.supplierInvoice);
      let remainingQuantity = invoice.items.find(item => args.rowData.productId == item.productId && args.rowData.internalBatchNumber == item.internalBatchNumber).remainingQuantity;
      console.log(remainingQuantity);
      if((args.data.packingNumber * args.data.packing + (args.data.bulk)) > remainingQuantity){
        var item = this.rows.find(item => args.rowData.id == item.id);
        this.notif.showNotification('mat-warn',"La quantité ne doit pas être superieure à la quantité restante , Quantité restante égale à " +  remainingQuantity ,'top','right');
        var index = this.rows.findIndex(x => x.id == args.rowData.id);
        item.packing= args.rowData.packing;
        item.packingNumber = args.rowData.packingNumber;
        item.bulk = args.rowData.bulk;
        if(index> -1) {
          (this.grid.dataSource as object[]).splice(index, 1);
          (this.grid.dataSource as object[]).splice(index, 0, item);
          this.grid.refresh();
        }
        return;
      }else{
        this.onLineGridChange(args.rowData, args.data);}
    }
  }
  async onLineGridChange(element: any, updatedElement: any) {
    if(this.form.valid) {
      let invoice = <SupplierInvoice> JSON.parse( this.navigation.extras.state.supplierInvoice);
      let remainingQuantity = invoice.items.find(item => element.productId == item.productId && element.internalBatchNumber == item.internalBatchNumber).remainingQuantity;
      console.log(remainingQuantity);
      let item = new CreateReceiptItemCommand();
      item.id = element.id;
      item.invoiceDate = this.form.value.invoiceDate;
      item.deliveryReceiptId = this.form.value.id;
      item.deliveryReceiptDate = this.form.value.deliveryReceiptDate;
      item.deliveryReceiptNumber = this.form.value.deliveryReceiptNumber;
      item.docRef = this.form.value.docRef;
      item.expiryDate = element.expiryDate;
      item.invoiceId = this.form.value.invoiceId;
      item.invoiceNumber = this.form.value.invoiceNumber;
      item.organizationId = this.form.value.organizationId;
      item.internalBatchNumber = element.internalBatchNumber;
      item.vendorBatchNumber = element.vendorBatchNumber;
      item.productCode = element.productCode;
      item.productId = element.productId;
      item.productName = element.productName;
      item.salePrice = element.salePrice;
      item.unitPrice = element.purchaseUnitPrice;
      item.purchaseUnitPrice = element.purchaseUnitPrice;
      item.pfs = element.pfs;
      item.ppa = updatedElement.ppa;
      item.packing =  ((updatedElement.packing == 0)  ? 1 :updatedElement.packing);
      item.packingNumber =updatedElement.packingNumber;
      console.log(element.bulk, updatedElement.bulk);
      let vrac = (element.bulk == updatedElement.bulk && (updatedElement.packing == 0 || updatedElement.packingNumber == 0)) ? (remainingQuantity - (updatedElement.packing  * updatedElement.packingNumber)) : updatedElement.bulk;
      item.bulk = vrac;
      item.quantity = (updatedElement.packingNumber) *  ((updatedElement.packing == 0)  ? 1 :updatedElement.packing) + vrac;
      this.rows.map(ele => {
        if(ele.internalBatchNumber == element.internalBatchNumber && ele.productId == element.productId ) {
          ele.quantity = item.quantity;
          ele.packing = item.packing;
          ele.bulk = item.bulk;
          ele.packingNumber = item.packingNumber;
        } 
        return ele;
      });
      
      item.totalAmount = this.getTotalTTCCart();
      item.taxTotalAmount = this.getTotalTVACart();
      item.discountTotalAmount = this.getTotalDiscountCart();
     
      this.form.get('totalAmountExlTax').setValue(item.totalAmount - item.taxTotalAmount);
      this.form.updateValueAndValidity();
      if(item.quantity == 0) await this.deliveryReceiptService.deleteReceiptItem(this.form.value.id, item.productId, item.internalBatchNumber,this.form.value.totalAmount , this.form.value.receiptsAmountExcTax).toPromise();
      else await this.deliveryReceiptService.updateItem(this.form.value.id,item).toPromise();
      this.rows.map(ele => {
        if(ele.internalBatchNumber == element.internalBatchNumber && ele.productId == element.productId ) {
          ele.quantity = item.quantity;
          ele.packing = item.packing;
          ele.bulk = item.bulk;
          ele.packingNumber = item.packingNumber;
        } 
        return ele;
      });
    }
  
    this.rows = this.rows.filter(ele => ele.quantity != 0);
    this.rows = [...this.rows];
  }

  save() {
    if(this.form.valid && this.rows.length) {
      this.deliveryReceiptService.save(this.form.value.id).subscribe(resp=> {
        this.notif.showNotification('mat-success','Le bon de reception est enregistré','top','right');
        this.route.navigate(['/procurment/delivery-receipt-list/']);

      },
      error=> {
        this.notif.showNotification('mat-success',error,'top','right');
      });
    }else if(this.rows.length == 0)
    this.notif.showNotification('mat-warn','Le bon de reception ne peut pas être enregistré, veuillez ajouter des produits','top','right');

  
  }
  async deleteDeliveryReceiptItem(orderItem: any) {
    let response = await this.dialogHelper.confirmDialog(this.dialog,'Êtes Vous sûr de bien vouloir supprimer la ligne');
    if(response) {
      let rows = this.rows.filter(
        (item) =>
          item.id != orderItem.id &&
          item.internalBatchNumber != orderItem.internalBatchNumber
      );
      this.rows = rows;

      let totalAmount = this.getTotalTTCCart();
      this.deliveryReceipt.totalAmount = totalAmount;
      let taxTotalAmount = this.getTotalTVACart();
      let receiptsAmountExcTax = totalAmount-taxTotalAmount;
        await this.deliveryReceiptService.deleteReceiptItem(this.form.value.id, orderItem.productId, orderItem.internalBatchNumber,totalAmount , receiptsAmountExcTax).subscribe(result => {
        this.notif.showNotification('mat-success','Produit supprimé avec succès','top','right');
        
      }, (error) => {
          this.notif.showNotification('mat-warn',error,'top','right');
      });
      this.deliveryReceipt.items = rows;
      this.deliveryReceipt.totalAmount = totalAmount;
      this.deliveryReceipt.receiptsAmountExcTax = receiptsAmountExcTax;
      this.form.get('totalAmountExlTax').setValue(receiptsAmountExcTax);
      this.form.get('totalAmount').setValue(totalAmount);
      this.grid.refresh();
      this.form.updateValueAndValidity();
    } else return null;
    
    
  }

  addProductLine() {
    if(!this.form.valid) {
      this.form.markAllAsTouched();
      this.notif.showNotification('mat-success','Veuillez renseigner les champs obligatoires','top','right');
      return;
    } 

    const dialogConfig = new MatDialogConfig();  
    dialogConfig.data = { 
      form: this.form.value, 
      supplierInvoice : this.supplierInvoice,
      deliveryReceipt : this.deliveryReceipt,
      rows : this.rows,
    };
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '75%';
    dialogConfig.minHeight = "450px"
    if(!this.dialogOpend)  {
      var modalRef = this.dialog.open(AddProductDeliveryReceiptComponent, dialogConfig);
      this.dialogOpend = true;
      modalRef.afterClosed().subscribe(res => {
      this.dialogOpend = false;
      this.grid.selectRow(0);
      if(res != null) {
       
        let productAlreadyExist = this.rows.find(ele => ele.productId == res.productId && ele.internalBatchNumber == res.internalBatchNumber);
        if(productAlreadyExist == null)  {
          let item = new CreateReceiptItemCommand();
          item.id = uuid.v4();
          item.invoiceDate = this.form.value.invoiceDate;
          item.deliveryReceiptId = this.form.value.id;
          item.deliveryReceiptDate = this.form.value.deliveryReceiptDate;
          item.deliveryReceiptNumber = this.form.value.deliveryReceiptNumber;
          item.docRef = this.form.value.docRef;
          item.expiryDate = res.expiryDate;
          item.invoiceId = this.form.value.invoiceId;
          item.invoiceNumber = this.form.value.invoiceNumber;
          item.organizationId = this.form.value.organizationId;
          item.internalBatchNumber = res.internalBatchNumber;
          item.vendorBatchNumber = res.vendorBatchNumber;
          item.productCode = res.productCode;
          item.productId = res.productId;
          item.productName = res.productName;
          item.salePrice = res.salePrice;
          item.unitPrice = res.unitPrice;
          item.purchaseUnitPrice = res.unitPrice;
          item.pfs = res.pfs;
          item.ppa = res.ppa;
          item.packing = res.packing == 0 ? 1 : res.packing;
          item.packingNumber = res.packingNumber;
          item.bulk = res.bulk;
          item.quantity = res.quantity;
          this.rows = [...this.rows,item];
          this.selected = [];
          this.selected = [...this.selected,item];
          this.form.updateValueAndValidity();
          this.grid.refresh();
          let totalAmount = this.getTotalTTCCart();
          let taxTotalAmount = this.getTotalTVACart();
          this.deliveryReceipt.totalAmount = totalAmount;
          this.deliveryReceipt.receiptsAmountExcTax = totalAmount - taxTotalAmount;
          this.deliveryReceipt.items = this.rows;
          this.form.get('totalAmount').setValue(totalAmount);
          this.form.get('totalAmountExlTax').setValue(totalAmount - taxTotalAmount);
          this.form.updateValueAndValidity();
          this.grid.refresh();
          this.addProductLine();
        } else {
          this.rows.map(ele => {
            if(ele.internalBatchNumber == res.internalBatchNumber && ele.productId == res.productId ) {
              ele.packingNumber= res.packingNumber;
              ele.packing = res.packing;
              ele.bulk=res.bulk;
              ele.quantity = ele.packingNumber * ele.packing + (ele.bulk);
            } 
            return ele;
          });
          this.rows = [...this.rows];
          let totalAmount = this.getTotalTTCCart();
          let taxTotalAmount = this.getTotalTVACart();
          this.deliveryReceipt.items = this.rows;
          this.deliveryReceipt.totalAmount = totalAmount;
          this.deliveryReceipt.receiptsAmountExcTax = totalAmount - taxTotalAmount;
          this.form.get('totalAmount').setValue(totalAmount);
          this.form.get('totalAmountExlTax').setValue(totalAmount - taxTotalAmount);
          this.form.updateValueAndValidity();
          this.grid.refresh();
        }
        
      }
    });
    }
   
  }
  
  async getLineTotalTTC(deliveryReceipt) {
    let invoiceItem =  this.supplierInvoice.items.find(ele => ele.productId == deliveryReceipt.productId &&  ele.internalBatchNumber == deliveryReceipt.internalBatchNumber);
    // let tax = this.cachedProduct.find(c => c.id == invoiceItem.productId).tax;
    let tax = await this.productService.getTaxProduct(deliveryReceipt.productId).toPromise();
    let ht = this.calculHelper.getTotalHt(invoiceItem.purchaseUnitPrice, deliveryReceipt.quantity);
    let totalDiscount = this.calculHelper.getTotalDiscount(invoiceItem.discount * 100,0,ht);
    let totalTva = this.calculHelper.getTotalTva(tax,ht,totalDiscount);
    return ht - totalDiscount + totalTva;
  }
  getTotalTTCCart() {
    let totalTTC = 0;
    if(this.rows.length) {
      this.rows.forEach(async element => {
        let c = await this.getLineTotalTTC(element);
        totalTTC += c;
      });
      let total = (parseFloat)(totalTTC.toFixed(2));
      let tvaAmount = this.getTotalTVACart();
      console.log(total, tvaAmount);
      this.form.patchValue({
        totalAmount: total,
        totalAmountExlTax: total - tvaAmount
      });
      this.form.updateValueAndValidity();
      return total;
    }else{
      return 0;
    }
    //this.form.get('totalAmountExlTax').setValue(total);
  }
  getTotalLineDiscount(invoiceItem: any) {
    let ht = this.calculHelper.getTotalHt(invoiceItem.purchaseUnitPrice, invoiceItem.quantity);
    if(invoiceItem.discount == null) invoiceItem.discount  = 0;
    return this.calculHelper.getTotalDiscount(invoiceItem.discount,0,ht)
  }
  getTotalDiscountCart() {
    let totalDiscount= 0;
    this.rows.forEach(element => {
      let ht = this.calculHelper.getTotalHt(element.purchaseUnitPrice, element.quantity);
      let totalDiscountLine = this.calculHelper.getTotalDiscount(element.discount,0,ht);
      totalDiscount = totalDiscount + totalDiscountLine;
    });
    return (parseFloat)(totalDiscount.toFixed(2));
  }
  getTotalTVACart() {
    let totalTVA= 0;
    this.rows.forEach(async element => {
      // let tax = this.cachedProduct.find(c => c.id == element.productId).tax;
      let tax = await this.productService.getTaxProduct(element.productId).toPromise();

      let ht = this.calculHelper.getTotalHt(element.purchaseUnitPrice, element.quantity);
      let totalDiscountLine = this.calculHelper.getTotalDiscount(element.discount,0,ht);
      totalTVA = totalTVA + this.calculHelper.getTotalTva(tax,ht,totalDiscountLine);
    });
    return (parseFloat)(totalTVA.toFixed(2));
  }
  onDoubleClick(args: any): void{ 
    this.setFocus = args.column;  // Get the column from Double click event 
  } 
  customNegativeValueValidationFn(args) {
    if(args.value >= 0){ 
      return true; 
    } else 
    return false; 
  }
  customQuantityValidationFn(args){
    if((args.rowData.packingNumber * args.rowData.packing + (args.rowData.bulk)) > args.rowData.remainingQuantity){
      return true;
    }else
    return false ;
  }
 }
