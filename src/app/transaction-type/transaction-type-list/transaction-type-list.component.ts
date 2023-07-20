import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionService } from 'src/app/services/permission.service';
import { TransactionTypeService } from 'src/app/services/transaction-type.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { environment } from 'src/environments/environment';
import { TransactionTypeAddComponent } from '../transaction-type-add/transaction-type-add.component';

@Component({
  selector: 'app-transaction-type-list',
  templateUrl: './transaction-type-list.component.html',
  styleUrls: ['./transaction-type-list.component.sass']
})
export class TransactionTypeListComponent implements OnInit {

  data: DataManager;
  isSales : boolean = false;
  isSuprvisor : boolean = false;
  gridLines: string;

  constructor(private dialog: MatDialog, 
    private authService : AuthService,
    private transactionTypeService : TransactionTypeService,
    private notif: NotificationHelper, private permService: PermissionService) { }

  ngOnInit(): void {

    this.gridLines = "Both";
    this.loadData();
  }
  confirmDialog(row): void {
    
    const message = 'Est-vous sûr de vouloir supprimer ' + row.name;
 
    const dialogData = new ConfirmDialogModel("Confirmation", message);
 
    const dialogRef = this.dialog.open(ConfimDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
 
    dialogRef.afterClosed().subscribe(dialogResult => {
     if(dialogResult) {
      this.transactionTypeService.deleteTransactionType(row.id).subscribe(msg => {
        this.notif.showNotification('mat-primary', "La suppression a été terminée avec succès", 'top', 'right');
        this.loadData();
      }, (error) => {
        this.notif.showNotification('mat-warn', error, 'top', 'right');
        return;
      });
     }
    });
   
  }
  loadData() {
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "transactionType" + "/search",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.authService.getToken }],
    });
  }
 
  add() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
   // dialogConfig.width ="400px";
    var modalRef = this.dialog.open(TransactionTypeAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(x=> {
      this.loadData();
    });
  }
  
  async edit(row ) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = row;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    var modalRef = this.dialog.open(TransactionTypeAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      if(data!=null)
        this.loadData();
    });
  }

  delete (row) {
    this.confirmDialog(row);
  }

}
