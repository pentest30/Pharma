import { UploadImageAddComponent } from './../../upload-image/upload-image-add/upload-image-add.component';
import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import { ProductService } from 'src/app/services/product.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { Product } from '../prodcut-models/product';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionService } from 'src/app/services/permission.service';
import { ActionsPermissions } from '../prodcut-models/product.permission';
import { environment } from "src/environments/environment";
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.sass']
})
export class ProductListComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = [ 'fullName', 'code','productClass','manufacturer','state','quota','actions'];
  perm : ActionsPermissions;
  public searchTerm = "";
  @ViewChild('grid') public grid: GridComponent;
  public cannotValidateProduct :any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  gridLines: string;

  data: DataManager;
  public productState: string[]  = ["Brouillon", "Validé", "Désactivé"];
  public Quotas : string[] = ["Quota" , "Non Quota"];
  constructor( private route :Router,
    private service  : ProductService,
    private permissionService: PermissionService,
     private dialog: MatDialog,
      private snackBar : MatSnackBar,
       private notifHelper : NotificationHelper,
        private authService : AuthService) { super(null, null) }
  openDialog() {

 }
  ngOnInit(): void {
    this.gridLines = "Both";
    this.selectionOptions = { mode: "Row" };
    this.perm = this.permissionService.getCatalogModulePermissions();
  try {
    this.reloadDataGrid();
  } catch (error) {
    this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
  }


  }


  ngAfterViewInit() {

  }
  edit (row ) {
    var p = new Product();
    p.id =row.id;
    p.productClassId = row.productClassId;
    this.route.navigate(['/product/product-edit/'], { state: { product: p } });
   }
   delete (row) {
      this.confirmDialog(row);
   }
   validate(row:Product) {
    if(row.purchasePrice>row.salePrice){
    const message = 'Le prix d\'achat est supérieur au prix de vente!\nVoulez vous continuer? ';
    const dialogData = new ConfirmDialogModel("Confirmation", message);
    const dialogRef = this.dialog.open(ConfimDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
     if(!dialogResult) {
  return;
     }});
  }
  else{
  this.service.validate(row).subscribe(msg => {

    this.notifHelper.showNotification('mat-primary', "L'activation du produit a été terminée avec succès", 'top', 'right');
    this.reloadDataGrid();
  }, (error) => {
    this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
    return;
  });
}


   }
   deactivate (row) {
    this.service.disable(row).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "La désactivation du produit a été terminée avec succès", 'top', 'right');
      this.reloadDataGrid();
    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
   }
   activate (row) {
    this.service.enable(row).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "L'activation du produit a été terminée avec succès", 'top', 'right');
      this.reloadDataGrid();
    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
   }
   quota (row) {
    this.service.hasQuota(row).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "Le produit a été ajouté à la liste des Quotas avec succès", 'top', 'right');
      this.reloadDataGrid();
    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
   }
   removeQuota (row) {
    this.service.deleteQuota(row).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "Le produit a été retiré de la liste des Quotas avec succès", 'top', 'right');
     this.reloadDataGrid();
    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
   }
   uploadImages (row ) {
    var p = new Product();
    p.id =row.id;
    p.productClassId = row.productClassId;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {product : p};
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    const modalRef = this.dialog.open(UploadImageAddComponent, dialogConfig);

   }
   reloadDataGrid(){
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "products" + "/search",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.authService.getToken }],
    });
   }
   confirmDialog(row : Product) {
    console.log(row);
    const message = 'Est-vous sûr de vouloir supprimer ' + row.fullName;

    const dialogData = new ConfirmDialogModel("Avertissement", message);

    const dialogRef = this.dialog.open(ConfimDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
     if(dialogResult) {
      this.service.delete(row).subscribe(msg => {
        this.notifHelper.showNotification('mat-primary', "La suppression a été terminée avec succès", 'top', 'right');
        this.reloadDataGrid();
      }, (error) => {
        this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
        return;
      });
     }
    });

  }

}
