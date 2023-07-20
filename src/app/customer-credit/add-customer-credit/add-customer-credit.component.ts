import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommandClickEventArgs, GridComponent, KeyboardEventArgs } from '@syncfusion/ej2-angular-grids';
import { InvoiceService } from 'src/app/services/invoice.service';
import { DialogHelper } from 'src/app/shared/DialogHelper';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { loadCldr, setCulture } from '@syncfusion/ej2-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddLineCreditNoteComponent } from '../add-line-credit-note/add-line-credit-note.component';
import { Invoice } from 'src/app/billing/models/Invoice';
import { CreditNoteService } from 'src/app/services/credit-note.service';

@Component({
  selector: 'app-add-customer-credit',
  templateUrl: './add-customer-credit.component.html',
  styleUrls: ['./add-customer-credit.component.sass']
})
export class AddCustomerCreditComponent implements OnInit {
  dialogOpend: any;
  @ViewChild('grid') public grid: GridComponent;
  rows: any[] = [];
  navigation: any;
  gridLines: string;
  toolbarItems: ({ text: string; tooltipText: string; id: string; cssClass?: undefined; } | { text: string; tooltipText: string; id: string; cssClass: string; })[];
  editOptions: { allowEditing: boolean; allowAdding: boolean; allowDeleting: boolean; mode: string; };
  commands: { type: string; buttonOption: { iconCss: string; cssClass: string; }; }[];
  invoiceId: any;
  invoice: Invoice;
  setFocus: any;
  quantityRules: { required: any[]; };
  public form: FormGroup;  
  creditNote: any;
  @HostListener('resize', ['$event'])
  onResize(event) {
    var offsetHeight = event.target.innerHeight - 350 ;
    setTimeout(()=> {
      this.grid.height = offsetHeight + "px";
    }, 0);
  
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(!this.dialogOpend) {
      switch (event.key) {
        case "-":
          event.preventDefault();
          let orderItem = this.rows[this.grid.selectedRowIndex];
          this.deleteCreditLine(orderItem);
          break;
        case "F2":
          event.preventDefault();
          this.save();
          break;
        case "F3":
          event.preventDefault();
          this.addCreditLine();
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
          break;
        case "+":
          event.preventDefault();
          this.addCreditLine();
          break;
        // case "Enter":
        //   break;
        default:
          break;
      }
    }
   
  }
  constructor(
    private invoiceService: InvoiceService,
    private creditNoteService: CreditNoteService,
    private notif: NotificationHelper,
    private dialogHelper: DialogHelper,
    private route: Router,
    private fb: FormBuilder,
    private dialog: MatDialog, 

  ) {
    this.navigation = route.getCurrentNavigation();
    setCulture('fr');
    loadCldr(require('./../../sales/numbers.json'));
  }

  async ngOnInit(){
    this.gridLines = 'Both';
    this.quantityRules = {required:[this.customMaxQuantityReturned,"Valeur min  0"]};

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
  
    if(this.navigation.extras.state == undefined) this.route.navigate(['/customer-credit/customer-credit-list/']);
    else {
      console.log(this.navigation.extras.state.invoiceId);
      this.invoiceId = this.navigation.extras.state.invoiceId;
      this.creditNote = this.navigation.extras.state.creditNote;

      this.invoice =  <Invoice>await this.invoiceService.getInvoiceById(this.invoiceId).toPromise();
      if(this.creditNote != null) {
        this.rows = this.creditNote.creditNoteItems;
        let items = this.invoice.invoiceItems;
        this.rows.map(element => {
          console.log(element);
          let invoiceItem = items.find(c => c.productId == element.productId && c.internalBatchNumber == element.internalBatchNumber && c.vendorBatchNumber == element.vendorBatchNumber);
          console.log(invoiceItem);
          element.returnedQty = invoiceItem.returnedQty; 
        });
      }
    
    }
    await this.createForm();

  }
  createForm() {
  
    this.form = this.fb.group({
      id: [(this.creditNote) ? this.creditNote.id : null, []],
      totalPackageThermolabile: [0, []],
      totalPackage: [0, []],
      invoiceId : [this.invoiceId, []],
      productReturn : [true, []],
      claimNumber : [(this.creditNote) ? this.creditNote.claimNumber : null, [Validators.required]],
      claimNote : [(this.creditNote) ? this.creditNote.claimNote : null, []],
      claimReason : [(this.creditNote) ? this.creditNote.claimReason : null, [Validators.required]],
      claimDate : [(this.creditNote) ?  this.creditNote.claimDate : null, [Validators.required]],
      creditNoteItems: [[], []]
    });
  }
  customMaxQuantityReturned(args) {
    if(args.value >= 0){ 
      return true; 
    } else 
    return false; 
  }
  addCreditLine() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { 
      form: this.form.value, 
      invoice: this.invoice,
    };
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';
    if(!this.dialogOpend)  {
      var modalRef = this.dialog.open(AddLineCreditNoteComponent, dialogConfig);
      this.dialogOpend = true;
      modalRef.afterClosed().subscribe(res => {
        this.dialogOpend = false;
        this.grid.selectRow(0);
        if(res != null) {
            this.rows.push(res);
            this.grid.refresh();

        }
      });
    }
  }
  save() {
    console.log(this.form.value, this.form.valid);
    this.form.value.creditNoteItems = this.rows;
    if(this.form.value.id != null && this.form.valid && this.rows.length) {
      this.creditNoteService.updateCreditNote(this.form.value.id,this.form.value).subscribe(resp=> {
        this.notif.showNotification('mat-success','Avoir client mis à jour avec succès','top','right');
        this.route.navigate(['/customer-credit/customer-credit-list/']);

      },
      error=> {
        this.notif.showNotification('mat-success',error,'top','right');
      });
    }
    if(this.form.value.id == null && this.form.valid && this.rows.length) {
      this.invoiceService.createCreditNote(this.form.value).subscribe(resp=> {
        this.notif.showNotification('mat-success','Avoir client est enregistré','top','right');
        this.route.navigate(['/customer-credit/customer-credit-list/']);

      },
      error=> {
        this.notif.showNotification('mat-success',error,'top','right');
      });
    }
    else if(this.rows.length == 0)
      this.notif.showNotification('mat-warn','Le bon de reception ne peut pas être enregistré, veuillez ajouter des produits','top','right');
  }
  async deleteCreditLine(orderItem: any) {
    let response = await this.dialogHelper.confirmDialog(this.dialog,'Êtes Vous sûr de bien vouloir supprimer la ligne');
    if(response) {
      let rows = this.rows.filter(
        (item) =>
          item.id != orderItem.id &&
          item.internalBatchNumber != orderItem.internalBatchNumber
      );
      this.rows = rows;
      this.form.value.CreditNoteItems = rows;
      this.grid.refresh();
      this.form.updateValueAndValidity();
    } else return null;
    
  }
  actionComplete(args) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      this.setFocus.edit.obj.element.focus();
    }
    if ((args.requestType === 'save')) {
      let row = args.rowData;
      let invoiceItem = this.invoice.invoiceItems.find(c => c.internalBatchNumber == row.internalBatchNumber && c.vendorBatchNumber == row.vendorBatchNumber && c.productId ==  row.productId);
      console.log(invoiceItem.returnedQty);
      if(args.data.quantity > (invoiceItem.quantity - invoiceItem.returnedQty)){
        this.notif.showNotification('mat-warn',"La quantité ne doit pas depasser la quantité a retourner " +  row.returnedQty ,'top','right');
        var item = this.rows.find(item => item.internalBatchNumber == row.internalBatchNumber && item.vendorBatchNumber == row.vendorBatchNumber && item.productId ==  row.productId);
        console.log(args.rowData);
        var index = this.rows.findIndex(item => 
          item.internalBatchNumber == row.internalBatchNumber && 
          item.vendorBatchNumber == row.vendorBatchNumber && 
          item.productId ==  row.productId);
          console.log(index);

        if(index> -1) {
          (this.grid.dataSource as object[]).splice(index, 1);
          (this.grid.dataSource as object[]).splice(index, 0, args.rowData);
          this.grid.refresh();
        }
        return;
      } else {
        //this.onLineGridChange(args.rowData, args.data);
      }
    }
  }
  onLineGridChange(rowData: any, data: any) {
    throw new Error('Method not implemented.');
  }
  commandClick(args: CommandClickEventArgs): void {
    this.deleteCreditLine(args.rowData)
  }
  getIndexRow(index) {
    return this.grid.getRowIndexByPrimaryKey(index) + 1;
  }
  created(){
  } 
  filter() {

  }
  clickHandler(args: ClickEventArgs): void {
    switch (args.item.id) {
      case 'addarticle':
        this.addCreditLine();
        break;
      case 'deletearticle':
        let orderItem = this.rows[this.grid.selectedRowIndex];
        this.deleteCreditLine(orderItem);
        break;
      case 'filter':
        this.filter();
        break;
      case 'saveorder':
        this.save();
        break;
      case 'viewlines':
        //this.view(this.deliveryReceipt);
        break;
      default:
        break;
    }
  }
  onDoubleClick(args: any): void{ 
    this.setFocus = args.column;  // Get the column from Double click event 
  
  } 
  public dataBound(e) {
    this.grid.selectRow(0);
    this.grid.height = window.innerHeight - 350;
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
}
