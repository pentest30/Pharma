import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridComponent, GridModel } from '@syncfusion/ej2-angular-grids';
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { CreditNoteService } from 'src/app/services/credit-note.service';
import { PermissionService } from 'src/app/services/permission.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { DateHelper } from 'src/app/shared/date-helper';
import { DialogHelper } from 'src/app/shared/DialogHelper';
import { ErrorParseHelper } from 'src/app/shared/helpers/ErrorParseHelper';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { CustomerCreditDetailComponent } from '../customer-credit-detail/customer-credit-detail.component';
import { InvoiceCustomerComponent } from '../invoice-customer/invoice-customer.component';
import { CreditNote } from '../models/CreditNote';
import { CreditNoteItem } from '../models/CreditNoteItem';

@Component({
  selector: 'app-customer-credit-list',
  templateUrl: './customer-credit-list.component.html',
  styleUrls: ['./customer-credit-list.component.sass']
})
export class CustomerCreditListComponent extends  BaseComponent implements OnInit {
  @ViewChild('grid') public grid: GridComponent;
  public childGrid: GridModel = {
    dataSource: [],
    queryString: 'creditNoteId',
    columns: [
        { field: 'creditNoteId', headerText: 'N°', textAlign: 'Right', width: 80 , visible : false},
        { field: 'productCode', headerText: 'Code produit', width: 90 },
        { field: 'productName', headerText: 'Nom', width: 250 },
        { field: 'vendorBatchNumber', headerText: 'Lot Fr', width: 150  },
        { field: 'internalBatchNumber', headerText: 'Lot Int', width: 150 },
        { field: 'unitPrice', headerText: 'P.U', width: 150 , type:"number", format:"N2"},
        { field: 'quantity', headerText: 'Qnt', width: 150 },
        { field: 'pfs', headerText: 'SHP', width: 150 , type:"number", format:"N2"},
        { field: 'ppaHT', headerText: 'PPA HT', width: 150 , type:"number", format:"N2"},
        { field: 'expiryDate', headerText: 'DDP', width: 150 ,format:'dd/MM/yyyy', type:'date'},
    ],
  };
  isOpen: boolean;
  invoiceId: any;
  invoice: any;
  constructor( 
    private creditNoteService: CreditNoteService,
    private notif: NotificationHelper,
    private permissionService: PermissionService,
    private dialog: MatDialog,
    private dialogHelper: DialogHelper,
    private dateHelper: DateHelper,
    private fb: FormBuilder,
    private _auth: AuthService,
    private parseErrorHelper: ErrorParseHelper,
    private route: Router,
    private notifHelper : NotificationHelper) {
    super(_auth,"credit-notes/");
  }

  ngOnInit(): void {
    this.loadData();
  }
  public dataBound(e) {


    var details :  CreditNoteItem[] = [];
    for (let index = 0; index < this.grid.getCurrentViewRecords().length; index++) {
      const element = this.grid.getCurrentViewRecords()[index] as CreditNote;

      for (let index = 0; index < element.creditNoteItems.length; index++) {
        const item = element.creditNoteItems[index];
        details.push(item);
        
      }
    }
    this.childGrid.dataSource = details;
  }
  async add() {
    if( !this.permissionService.isSalesPerson() && !this.permissionService.isSalesManager()&& !this.permissionService.isSupervisor()) { 
      this.notif.showNotification('mat-warn',"vous n'êtes pas autorisé de créer une commande", null, null);
       return;
    }
    if(!this.isOpen ) {
      this.isOpen = true;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = "100vh";
      dialogConfig.height = "100%";
      dialogConfig.width = "100%";
      dialogConfig.panelClass= 'full-screen-modal'
      var ref=  this.dialog.open(InvoiceCustomerComponent, dialogConfig);
      const sub = ref.componentInstance.onAdd.subscribe(res => {
        this.isOpen = false;
        if(res) this.invoice = res;
      });
      ref.afterClosed().subscribe(res => {
        if(!res)
        {
          this.isOpen = false;
          return;
        }
        this.route.navigate(['/customer-credit/add-customer-credit/'], { state: { order: null, operation: 0 ,invoiceId: this.invoice.id } });
        this.isOpen = false;
      });
    }
  }
  async edit(row) {
    let creditNote = await this.creditNoteService.getById(row.id).toPromise();
    console.log(creditNote);
    this.route.navigate(['/customer-credit/add-customer-credit/'], { state: { creditNote: creditNote, operation: 0 ,invoiceId: creditNote.invoiceId } });

  }
  async view(row) {
    let creditNote = await this.creditNoteService.getById(row.id).toPromise();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { 
      creditNote: creditNote, 
    };
    dialogConfig.disableClose = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';
    if(!this.isOpen)  {
      var modalRef = this.dialog.open(CustomerCreditDetailComponent, dialogConfig);
      this.isOpen = true;
      modalRef.afterClosed().subscribe(res => {
        this.isOpen = false;
      });
    }
  }
 
  validate(row) {
    this.creditNoteService.validateCreditNote(row.id,row).subscribe(resp=> {
      this.notif.showNotification('mat-success','Avoir client est validé','top','right');
      this.loadData();
      this.route.navigate(['/customer-credit/customer-credit-list/']);

    },
    error=> {
      this.notif.showNotification('mat-success',error,'top','right');
    });
  }
  async delete(row) {
    this.confirmDialog(row);
  }
  confirmDialog(row : CreditNote) {
    console.log(row);
    const message = 'Est-vous sûr de vouloir supprimer ' + row.claimNumber;

    const dialogData = new ConfirmDialogModel("Avertissement", message);

    const dialogRef = this.dialog.open(ConfimDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult) {
       this.creditNoteService.delete(row).subscribe(msg => {
         this.notifHelper.showNotification('mat-primary', "La suppression a été terminée avec succès", 'top', 'right');
         this.loadData();
       }, (error) => {
         this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
         return;
       });
      }
     });
 
   }
}
