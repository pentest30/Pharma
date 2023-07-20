import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import { ActionsPermissions } from 'src/app/product/prodcut-models/product.permission';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionService } from 'src/app/services/permission.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { UserApp } from '../../models/user-app';
import { UserAddComponent } from '../user-add/user-add.component';
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.sass']
})
export class UserListComponent implements OnInit {

  
  perm : ActionsPermissions;
  public searchTerm = "";
  gridLines: string;
  selectionOptions: { mode: string; };
  data: DataManager;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
 
  constructor( private route :Router,
    private service  : UserService,
     private dialog: MatDialog,
      private snackBar : MatSnackBar,
       private notifHelper : NotificationHelper,
       private permissionService : PermissionService,
        private authService : AuthService) { }
  openDialog() {
    this.createModalDialog({});
 }
 private createModalDialog(item) {
  console.log(item);
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data = item;
  dialogConfig.disableClose = false;
  dialogConfig.autoFocus = true;
  var modalRef = this.dialog.open(UserAddComponent, dialogConfig);
  modalRef.afterClosed().subscribe(d => {
    if (d != null)
      this.loadData();
  });
}
  ngOnInit(): void {
   this.perm = this.permissionService.getMembershipModulePermissions();
    this.searchTerm = "";
    this.gridLines = "Both";
    this.selectionOptions = { mode: "Row" };
    this.loadData();
  }
 
  loadData() {
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "users/search",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.authService.getToken }],
    });
  }
  
  
  edit (row : UserApp) {
    console.log(row);
    this.createModalDialog(row);
   }
   delete (row) {
      this.confirmDialog(row);
   }
  
   deactivate ( row) {
     
   }
  

   confirmDialog(row  : UserApp): void {
    console.log(row);
    const message = 'Est-vous sûr de vouloir supprimer ' + row.userName;
 
    const dialogData = new ConfirmDialogModel("Confirmation", message);
 
    const dialogRef = this.dialog.open(ConfimDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
 
    dialogRef.afterClosed().subscribe(dialogResult => {
     if(dialogResult) {
      this.service.delete(row.id).subscribe(msg => {
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
