import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommandClickEventArgs, GridComponent, KeyboardEventArgs } from '@syncfusion/ej2-angular-grids';
import { loadCldr, setCulture } from '@syncfusion/ej2-base';
import { AuthService } from 'src/app/services/auth.service';
import { SupplierInvoiceService } from 'src/app/services/supplier-invoice.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import * as uuid from 'uuid';
import { AddProductSupplierInvoiceComponent } from '../add-product-supplier-invoice/add-product-supplier-invoice.component';
import { CreateInvoiceItemCommand, SupplierInvoiceItem } from '../models/SupplierInvoiceItem';
import { SupplierOrder } from '../models/SupplierOrder';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { SupplierInvoice } from '../models/SupplierInvoice';
import { SupplierOrderService } from 'src/app/services/supplier-order.service';
import { DateHelper } from 'src/app/shared/date-helper';
import { CalculMethodHelper } from 'src/app/shared/CalculMethodHelper';
import { DialogHelper } from 'src/app/shared/DialogHelper';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-supplier-invoice',
  templateUrl: './add-supplier-invoice.component.html',
  styleUrls: ['./add-supplier-invoice.component.sass']
})
export class AddSupplierInvoiceComponent implements OnInit {
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
  products: any[] = [];
  rows: any[] = [];
  selected: any[] = [];
  dialogOpend: any;
  @ViewChild('batchgrid') public grid: GridComponent;
  supplierOrder: SupplierOrder;
  quantityRules: { required: any[]; };
  AmountTTCRules: { required: any[]; };
  @ViewChild('refDocument') refDocumentRef: ElementRef;
  @ViewChild('totalAmount') totalAmountRef: ElementRef;
  @ViewChild('totalAmountExcTax') totalAmountExcTaxRef: ElementRef;
  pfsRules: { required: any[]; };
  ecartTTC: number = 0;
  setFocus: any;
  totalhtdiscounted: number = 0;
  public extraDiscountRules: object;
  totalHt: number = 0;

  @HostListener('resize', ['$event'])
  onResize(event) {
    var offsetHeight = event.target.innerHeight -480 ;
    setTimeout(()=> {
      this.grid.height = offsetHeight + "px";
    }, 0);
  
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(!this.dialogOpend) {
      switch (event.key) {
        case "+":
          event.preventDefault();
          if(this.form.value.supplierId == null) {
            this.notif.showNotification('mat-danger','Merci de  selectionner votre fournisseur','top','right');
          } else {
            this.addProductLine();
          }
          break;
        case "-":
          event.preventDefault();
          let orderItem = this.rows[this.grid.selectedRowIndex];
          this.deleteSupplierInvoiceItem(orderItem);
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
          this.cancelOrder();
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
    private route: Router,
    private supplierInvoiceService: SupplierInvoiceService,
    private supplierOrderService: SupplierOrderService,
    private _auth: AuthService,
    private supplierService: SupplierService,
    private dateHelper:DateHelper,
    private calculHelper: CalculMethodHelper,
    private confirmDialog: DialogHelper,
    private productService: ProductService,
    private dialog: MatDialog, private el: ElementRef) {

      this.navigation = route.getCurrentNavigation();
      setCulture('fr');
      loadCldr(require('./../../sales/numbers.json'));

    }


  async ngOnInit() {
    this.gridLines = 'Both';
    this.pfsRules = {required:[this.customPfsValidationFn,"Valeur min  0"]};
    this.quantityRules = {required:[this.customQuantityValidationFn,"Valeur min  1"]};
    this.AmountTTCRules = {required:[this.customAmountValidationFn,"Montant ttc dépassé"]};
    this.extraDiscountRules = { required:[this.customDiscountValidationFn,"Valeur comprise entre 0 et 100%"] };

    this.toolbarItems = [
      { text: 'Ajouter Article (F3 / +)', tooltipText: 'Ajouter un Article', id: 'addarticle' },
      { text: 'Supprimer Article (-)', tooltipText: 'Sauvgarder la commande', id: 'deletearticle' },
      { text: 'Filtrer (F9)', tooltipText: 'Sauvgarder la commande',  id: 'filter' },
      { text: 'Sauvgarder (F2)', tooltipText: 'Sauvgarder la commande', id: 'saveorder' },
      { text: 'Annuler (F5)', tooltipText: 'Annuler',  id: 'cancelorder' },
      { text: 'Visualiser (F8)', tooltipText: 'Visualiser', id: 'viewlines' , cssClass:'e-info'},

    ];
  
    this.editOptions = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
    
    this.commands = [
      { type: 'None', buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat'} },
    ];
  
    if(this.navigation.extras.state == undefined) this.route.navigate(['/procurment/supplier-invoices-list/']);
    else {
      this.supplierId = this.navigation.extras.state.supplier.id;
      this.supplier = this.navigation.extras.state.supplier;
      this.supplierOrder = JSON.parse(this.navigation.extras.state.supplierOrder);
  
      this.selectedSupplier = this.supplier.organizationId;
  
      this.suppliers.push(this.supplier);
      this.onSupplierSelection( this.selectedSupplier);
    }
    // this.cachedProduct = <any>  (await this.dbService.getAll("products")).shift();
    this.onCommandTypeSelection((this.supplierOrder?.psychotropic) ? 1 : 0);
    await this.createForm();
    if(this.refDocumentRef && this.refDocumentRef.nativeElement) this.refDocumentRef.nativeElement.focus();
    if(this.navigation.extras.state && this.navigation.extras.state.supplierInvoice != null) {
      let invoice = <SupplierInvoice> this.navigation.extras.state.supplierInvoice;
      console.log(invoice);
      // Edition
      this.form.setValue({
        customerId: invoice.customerId,
        customerName: invoice.customerName,
        supplierId: invoice.supplierId,
        supplierName: invoice.supplierName,
        id: invoice.id,
        invoiceDate: invoice.invoiceDate,
        refDocument: invoice.refDocument,
        orderId: invoice.orderId,
        invoiceNumber: invoice.invoiceNumber,
        totalAmount: invoice.totalAmount,
        totalAmountExlTax: invoice.totalAmountExlTax
      });
      this.rows = invoice.items.map(ele => {
        ele.discount = ele.discount * 100;
        return ele;
      });
    }
  }
  // on key enter attributes

  onRefDocumentKeyEnter(event) {
    document.getElementById("invoiceDate").focus();

  }
  onInvoiceDateKeyEnter(event) {
    this.totalAmountRef.nativeElement.focus();
  }
  onTotalAmountEnter(event) {
    this.totalAmountExcTaxRef.nativeElement.focus();
  }
  // on input change events
  async onRefDocumentChange(refDoc) {
    let invoice = <SupplierInvoice> await this.supplierInvoiceService.getInvoiceByRefSync({
      invoiceDate: this.dateHelper.convertUTCDateToLocalDate(this.form.value.invoiceDate),
      documentRef: refDoc,
      supplierId: this.form.value.supplierId
    }).toPromise();
    if(invoice != null && invoice.invoiceStatus == 0) {
      this.setCurrentInvoice(invoice);
    
    } 
  } 
  async setCurrentInvoice(invoice: SupplierInvoice) {
    let supplierOrder = <SupplierOrder>await this.supplierOrderService.getById(invoice.orderId).toPromise();
    let supplier = await this.supplierService.getSupplierByOrgId(invoice.supplierId).toPromise();
    this.form.setValue({
      customerId: invoice.customerId,
      customerName: invoice.customerName,
      supplierId: invoice.supplierId,
      supplierName: invoice.supplierName,
      id: invoice.id,
      invoiceDate: invoice.invoiceDate,
      refDocument: invoice.refDocument,
      orderId: invoice.orderId,
      invoiceNumber: invoice.invoiceNumber,
      totalAmount: invoice.totalAmount,
      totalAmountExlTax: invoice.totalAmountExlTax

    });
    this.rows = invoice.items.map(ele => {
      ele.discount = ele.discount * 100;
      return ele;
    });
    
    // this.rows = invoice.items;

    this.supplierOrder = supplierOrder;
    this.supplier = supplier;
  }
  async onInvoiceDateChange(invoiceDate) {
    let invoice = <SupplierInvoice> await this.supplierInvoiceService.getInvoiceByRefSync({
      invoiceDate: this.dateHelper.convertUTCDateToLocalDate(invoiceDate),
      documentRef: this.form.value.refDocument,
      supplierId: this.form.value.supplierId
    }).toPromise();
    if(invoice != null && invoice.invoiceStatus == 0) {
      this.setCurrentInvoice(invoice);
    
    } 
  } 
  createForm() {
    this.form = this.fb.group({
      customerId: [this._auth.profile.organizationId, [Validators.required]],
      customerName: [null, []],
      supplierId: [(this.supplierOrder) ? this.supplierOrder.supplierId : null, [Validators.required]],
      supplierName: [(this.supplier) ?  this.supplier.name : null, [Validators.required]],
      id: [uuid.v4(), []],
      invoiceDate: [new Date(), [Validators.required]],
      refDocument : [null, [Validators.required]],
      orderId : [(this.supplierOrder) ?  this.supplierOrder.id : null, [Validators.required]],
      invoiceNumber : [" ", []],
      totalAmount : [null, [Validators.required]],
      totalAmountExlTax : [null, [Validators.required,this.ValidatetotalAmountExlTax.bind(this)]],

    });
  }
  ValidatetotalAmountExlTax(control: AbstractControl): {[key: string]: any} | null  {
    if(this.form && this.form.value) {
    }
    if (control.value && this.form && this.form.value &&  this.form.value.totalAmount != null && control.value > this.form.value.totalAmount) {
      return { 'TTCInvalid': true };
    }
  }
  customPfsValidationFn(args) {
    if(args.value >= 0){ 
      return true; 
    } else 
    return false; 
  }
  customQuantityValidationFn(args) {
    if(args.value >= 1){ 
      return true; 
    } else 
    return false; 
  }
  customAmountValidationFn(args) {
    if(args.value >= 1){ 
      return true; 
    } else 
    return false; 
  }
  customDiscountValidationFn(args) {
    if(args.value <= 100 || args.value >= 0 ){ 
      return true; 
    } else 
    return false; 
  }
  async onSupplierSelection(event) {
    this.currentSupplier = event;

    
  }
  supplierSearchFn  (term: string, item: any) {
    if(term!=undefined) {
      term = term.toLocaleLowerCase();
      return (item.code != undefined && item.code.toLocaleLowerCase().indexOf(term) > -1)   ||  item.name.toLocaleLowerCase().indexOf(term) > -1;
    }
  }
  async onCommandTypeSelection(commandType) {
    let products  = [];
    this.isPsy = commandType == 1;
    // if(commandType == 0) products  = this.cachedProduct.filter(product => !product.psychotropic );
    // else products  = this.cachedProduct.filter(product => product.psychotropic );
    // this.products = products;

  }

  addProductLine() {
    if(!this.form.valid) {
      this.form.markAllAsTouched();
      this.notif.showNotification('mat-success','Veuillez renseigner les champs obligatoires','top','right');
      return;
    } 
    let totoalTTC = this.getTotalTTCCart();
    if(this.form.valid && this.form.value.totalAmount >= totoalTTC) {
      const dialogConfig = new MatDialogConfig();
      this.form.value.orderType =  this.isPsy? 1 : 0;
  
      dialogConfig.data = { 
        form: this.form.value, 
        products: this.products,
        rows: this.rows,
        currentSupplier : this.supplier,
        supplierOrder : this.supplierOrder,
        totoalTTC: totoalTTC
      };
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '75%';
      dialogConfig.minHeight = "450px"
      if(!this.dialogOpend)  {
        var modalRef = this.dialog.open(AddProductSupplierInvoiceComponent, dialogConfig);
        this.dialogOpend = true;
        modalRef.afterClosed().subscribe(res => {
        this.dialogOpend = false;
        this.grid.selectRow(0);
        if(res != null) {
        
          let productAlreadyExist = this.rows.find(ele => ele.productId == res.productId && ele.internalBatchNumber == res.internalBatchNumber);
          if(productAlreadyExist == null)  {
            let supplierOrderItem = new SupplierInvoiceItem();
            supplierOrderItem.id = uuid.v4();
            supplierOrderItem.productId = res.productId;
            supplierOrderItem.productName = res.productName;
            supplierOrderItem.productCode = res.productCode;
            supplierOrderItem.internalBatchNumber = res.internalBatchNumber;
            supplierOrderItem.vendorBatchNumber = res.vendorBatchNumber;
            supplierOrderItem.ppaHT = res.ppaHT;
            supplierOrderItem.ppaPFS = res.ppaPFS;
            supplierOrderItem.ppaTTC = res.ppaTTC;
            supplierOrderItem.pfs = res.pfs;                                                              
            supplierOrderItem.packing = res.packing;
            supplierOrderItem.pharmacistMargin = res.pharmacistMargin;
            supplierOrderItem.wholesaleMargin = res.wholesaleMargin;
            supplierOrderItem.pickingZoneId = res.pickingZoneId;
            supplierOrderItem.pickingZoneName = res.pickingZoneName;
            supplierOrderItem.packing = res.packing;
            supplierOrderItem.packagingCode = " ";
            supplierOrderItem.quantity = res.quantity;
            supplierOrderItem.purchaseUnitPrice = res.purchaseUnitPrice;
            supplierOrderItem.purchasePriceIncDiscount = res.purchasePriceIncDiscount;
            supplierOrderItem.discount = res.discount;
            supplierOrderItem.salePrice = res.salePrice;
            supplierOrderItem.expiryDate = res.expiryDate;
            this.rows = [...this.rows,supplierOrderItem];
            this.selected = [];
            this.selected = [...this.selected,supplierOrderItem];
            this.addProductLine();
          } else {
            this.rows.map(ele => {
              if(ele.productId == res.productId && ele.internalBatchNumber == res.internalBatchNumber) {
                ele.quantity+= res.quantity;
                ele.discount = res.discount;
                this.onQuantityChange(ele, ele.quantity);
  
              } 
            });
            this.grid.refresh();
          }
          
        }
      });
      }
    } else {
      this.notif.showNotification('mat-success','Total TTC Facturé depassé, Aucune ligne ne peut etre rajoutée','top','right');
    }
   
  }
  clickHandler(args: ClickEventArgs): void {
    switch (args.item.id) {
      case 'addarticle':
        this.addProductLine();
        break;
      case 'cancelorder':
        this.cancelOrder();
        break;
      case 'deletearticle':
        let orderItem = this.rows[this.grid.selectedRowIndex];
        this.deleteSupplierInvoiceItem(orderItem);
        break;
      case 'filter':
        this.filter();
        break;
      case 'saveorder':
        this.save();
        break;
      case 'viewlines':
        let invoice = new SupplierInvoice();
        invoice.supplierId = this.form.value.supplierId;
        invoice.customerId = this.form.value.customerId;
        invoice.totalAmount = this.form.value.totalAmount;
        invoice.totalAmountExlTax = this.form.value.totalAmountExlTax;

        invoice.id = this.form.value.id;
        invoice.items = this.rows;
        this.preview(invoice);
        break;
      default:
        break;
    }

  }
  public dataBound(e) {
    this.grid.height = window.innerHeight - 420;
    this.grid.selectRow(0);
  }
  created(){
    //this.addProductLine();
  } 
  actionComplete(args) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      if(this.setFocus) this.setFocus.edit.obj.element.focus();

    }
    if ((args.requestType === 'save')) {
      this.onQuantityChange(args.rowData, args.data);
      this.grid.refresh();

    }
  }

  onDoubleClick(args: any): void{ 
    this.setFocus = args.column;  // Get the column from Double click event 
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
          this.setFocus = focusColumns;
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
  save() {
    if(this.rows.length > 0 ) {
      let itemInvoice = this.rows.pop();
      if(itemInvoice != null) {
        let item = new CreateInvoiceItemCommand();
        item = itemInvoice;
        item.discount = item.discount / 100;
        item.documentRef = this.form.value.refDocument;
        item.orderId = this.form.value.orderId;
        item.invoiceId = this.form.value.id;
        item.supplierName = this.form.value.supplierName;
        item.supplierId = this.form.value.supplierId;
        item.invoiceNumber = this.form.value.invoiceNumber;
        item.documentRef = this.form.value.refDocument;
        item.invoiceDate = this.form.value.invoiceDate;
        item.totalAmount = this.form.value.totalAmount;
        item.totalAmountExlTax = this.form.value.totalAmountExlTax;
  
        this.updateSupplierInvoiceItem(this.form.value.id, item);
        this.route.navigate(['/procurment/supplier-invoices-list/']);
  
      }
    }
  }
  filter() {
    throw new Error('Method not implemented.');
  }
  async deleteSupplierInvoiceItem(orderItem: any) {
    let response = await this.confirmDialog.confirmDialog(this.dialog,'Êtes Vous sûr de bien vouloir supprimer le produit');
    if(response) {
        await this.supplierInvoiceService.deleteSupplierInvoiceItem(this.form.value.id, orderItem.productId, orderItem.internalBatchNumber).subscribe(result => {
        this.notif.showNotification('mat-success','Produit supprimé avec succès','top','right');
        let rows= this.rows.filter(item => item.productId != orderItem.productId && item.internalBatchNumber != orderItem.internalBatchNumber);
        this.rows = rows;
     
      }, (error) => {
          this.notif.showNotification('mat-warn',error,'top','right');
      });
    } else return null;
  }
  cancelOrder() {
    throw new Error('Method not implemented.');
  }
  async onQuantityChange(element: any, updatedElement: any) {
    element.customerId = this.form.value.customerId;
    let supplierInvoiceItem = new CreateInvoiceItemCommand();
    supplierInvoiceItem.invoiceId = this.form.value.id;
    supplierInvoiceItem.orderId = this.form.value.orderId;
    supplierInvoiceItem.supplierOrganizationId = this.form.value.supplierId;
    supplierInvoiceItem.invoiceNumber = (this.form.value.invoiceNumber == '') ? ' ' : this.form.value.invoiceNumber;
    supplierInvoiceItem.pickingZoneName = element.pickingZoneName;
    supplierInvoiceItem.productId = element.productId;
    supplierInvoiceItem.productName = element.productName;
    supplierInvoiceItem.internalBatchNumber = element.internalBatchNumber;
    supplierInvoiceItem.vendorBatchNumber = element.vendorBatchNumber;
    supplierInvoiceItem.discount = (updatedElement.discount) / 100;
    supplierInvoiceItem.salePrice = updatedElement.salePrice;
    supplierInvoiceItem.pfs = updatedElement.pfs;
    supplierInvoiceItem.ppaHT = updatedElement.ppaHT;
    // let tax = this.cachedProduct.find(c => c.id == updatedElement.productId).tax;
    let tax = await this.productService.getTaxProduct(updatedElement.productId).toPromise();

    let ppaTTC = this.calculHelper.calculPpaTTC(tax, updatedElement.ppaHT);
    supplierInvoiceItem.ppaTTC = ppaTTC;
    let ppaPFS = this.calculHelper.calculPpaPFS(ppaTTC, updatedElement.pfs);

    supplierInvoiceItem.purchaseUnitPrice = updatedElement.purchaseUnitPrice;
    let discountPurchasePrice = this.calculHelper.getDiscountPurchasePrice(updatedElement.purchaseUnitPrice,(updatedElement.discount) / 100);
    supplierInvoiceItem.purchasePriceIncDiscount = discountPurchasePrice;
    supplierInvoiceItem.wholesaleMargin = this.calculHelper.calculWholesaleMargin(discountPurchasePrice, updatedElement.salePrice);
    supplierInvoiceItem.pharmacistMargin = this.calculHelper.calculPharmacistMargin(updatedElement.ppaHT, updatedElement.salePrice);
    supplierInvoiceItem.ppaPFS = ppaPFS;
    supplierInvoiceItem.invoiceNumber = this.form.value.invoiceNumber;
    supplierInvoiceItem.invoiceDate = this.form.value.invoiceDate;
    supplierInvoiceItem.totalAmount = this.form.value.totalAmount;
    supplierInvoiceItem.totalAmountExlTax = this.form.value.totalAmountExlTax;
    supplierInvoiceItem.expectedDeliveryDate = this.form.value.expectedDeliveryDate;

    supplierInvoiceItem.packing = updatedElement.packing;
    supplierInvoiceItem.packagingCode =  element.packagingCode;
    supplierInvoiceItem.supplierName = '';
    supplierInvoiceItem.productCode = element.productCode;
    supplierInvoiceItem.documentRef = (this.form.value.refDocument == '') ? ' ' : this.form.value.refDocument ;
    supplierInvoiceItem.quantity = updatedElement.quantity;
    supplierInvoiceItem.expiryDate = updatedElement.expiryDate;
    let totalTTC = 0;
    this.rows.forEach(async element => {
      if(element.productId == supplierInvoiceItem.productId && element.internalBatchNumber == supplierInvoiceItem.internalBatchNumber) {
        supplierInvoiceItem.discount = supplierInvoiceItem.discount * 100;
        totalTTC += await this.getLineTotalTTC(supplierInvoiceItem);
        supplierInvoiceItem.discount = supplierInvoiceItem.discount / 100;
        
      }
      else totalTTC += await this.getLineTotalTTC(element);
    });
    if (totalTTC <= (this.form.value.totalAmount + 1 || this.form.value.totalAmount - 1) ) {
      this.updateItem(supplierInvoiceItem);
    } else  {
      let rows = this.rows.map(item => {
        if(item.productId == updatedElement.productId && item.internalBatchNumber == updatedElement.internalBatchNumber) {
          item.discount = element.discount;
          item.purchaseUnitPrice = element.purchaseUnitPrice;
          item.salePrice = element.salePrice;
          item.pfs = element.pfs;
          item.expiryDate = element.expiryDate;
          item.ppaHT = element.ppaHT;
          item.packing = element.packing;
          item.quantity = element.quantity;

        }
        return item;
      });
      this.rows = [...rows];
      this.notif.showNotification('mat-warn','Mise à jour annulée, Total TTC depassée','top','right');
    }
  }
  updateItem(supplierInvoiceItem: CreateInvoiceItemCommand) {
    let quantity = 0;
    this.rows.forEach(p => {
      if(p.productId == supplierInvoiceItem.productId && p.internalBatchNumber == supplierInvoiceItem.internalBatchNumber ) {
        quantity = quantity + p.quantity;
      }
    });
    supplierInvoiceItem.quantity = quantity;
    this.updateSupplierInvoiceItem(this.form.value.id,supplierInvoiceItem);
  }
  async updateSupplierInvoiceItem(id: any, supplierInvoiceItem: CreateInvoiceItemCommand) {
      var res = await this.supplierInvoiceService.updateInvoiceItemCommand(id,supplierInvoiceItem).toPromise();
      this.notif.showNotification('mat-success','Ligne facture mise à jour avec succès','top','right');
      let rows = this.rows.map(item => {
        if(item.productId == supplierInvoiceItem.productId && item.internalBatchNumber == supplierInvoiceItem.internalBatchNumber) {
          item.pfs = supplierInvoiceItem.pfs;
          item.ppaPFS = supplierInvoiceItem.ppaPFS;
          item.ppaTTC = supplierInvoiceItem.ppaTTC;
          item.ppaHT = supplierInvoiceItem.ppaHT;
          item.wholesaleMargin = supplierInvoiceItem.wholesaleMargin;
          item.pharmacistMargin = supplierInvoiceItem.pharmacistMargin;
        }
        return item;
      });
      this.rows = [...rows];
  }
  commandClick(args: CommandClickEventArgs): void {
    this.deleteSupplierInvoiceItem(args.rowData)
  }
  getIndexRow(index) {
    return parseInt(index) + 1 ;
  }
  
  async getLineTotalTTC(invoiceItem) {
    // let tax = this.cachedProduct.find(c => c.id == invoiceItem.productId).tax;
    let tax = await this.productService.getTaxProduct(invoiceItem.productId).toPromise();

    if(invoiceItem.discount == null) invoiceItem.discount  = 0;
    return this.calculHelper.getTotalTTC(invoiceItem.purchaseUnitPrice, invoiceItem.quantity,invoiceItem.discount, 0, tax );
  }
  async getTotalLineTva(invoiceItem: any) {
    // let tax = this.cachedProduct.find(c => c.id == invoiceItem.productId).tax;
    let tax = await this.productService.getTaxProduct(invoiceItem.productId).toPromise();

    let ht = this.calculHelper.getTotalHt(invoiceItem.purchaseUnitPrice, invoiceItem.quantity);
    let totalDiscount = this.getTotalLineDiscount(invoiceItem);
    return this.calculHelper.getTotalTva(tax,ht,totalDiscount);
  }
  getTotalLineDiscount(invoiceItem: any) {
    let ht = this.calculHelper.getTotalHt(invoiceItem.purchaseUnitPrice, invoiceItem.quantity);
    if(invoiceItem.discount == null) invoiceItem.discount  = 0;
    return this.calculHelper.getTotalDiscount(invoiceItem.discount,0,ht)
  }
  getTotalTTCCart() {
    
    let totalTTC = 0;
    this.rows.forEach(async element => {
      totalTTC +=  await this.getLineTotalTTC(element);
    });
    let totalTva = this.getTotalTVACart(); 
    this.totalhtdiscounted = totalTTC - totalTva;
    this.ecartTTC = this.form.get("totalAmount").value - totalTTC ;
    return (parseFloat)(totalTTC.toFixed(2));
  }
  getTotalCartHt(){
    this.totalHt = 0;
    this.rows.forEach(element => {
      this.totalHt+= this.calculHelper.getTotalHt(element.purchaseUnitPrice,element.quantity);
    });
    return this.totalHt;
  }
  getTotalDiscountCart() {
    let totalDiscount= 0;
    this.rows.forEach(element => {
      let ht = this.calculHelper.getTotalHt(element.purchaseUnitPrice, element.quantity);
      let totalLineDiscount = this.calculHelper.getTotalDiscount(element.discount,0,ht);
      totalDiscount = totalDiscount + totalLineDiscount;
    });
    return (parseFloat)(totalDiscount.toFixed(2));
  }
  getTotalTVACart() {
    let totalTVA= 0;
    this.rows.forEach(async element => {
      totalTVA = totalTVA + await this.getTotalLineTva(element);
    });
    return (parseFloat)(totalTVA.toFixed(2));
  }
  getUG(row) {
    let quantity = 0;
    let rows = this.rows.filter(ele => ele.productId == row.productId);

    rows.forEach(element => {
      quantity+=element.quantity;
    });
   
    if(row.discount != null ) 
    return this.calculHelper.calculUg(quantity, row.discount / 100).toFixed(1);
    else return 0; 
  }
}
