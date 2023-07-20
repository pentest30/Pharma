import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductClassAddComponent } from './../product-class-add/product-class-add.component';
import { ProductClassService } from './product-class.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product-class-list',
  templateUrl: './product-class-list.component.html',
  styleUrls: ['./product-class-list.component.sass']
})
export class ProductClassListComponent extends BaseComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  constructor(private productClassService : ProductClassService,
     private dialog: MatDialog,
      private snackBar : MatSnackBar,
      private auth: AuthService) {
    super(auth, "catalog/");
  }
  
  openDialog() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {};
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true; 
    dialogConfig.maxWidth = '60vw';
    dialogConfig.maxHeight = "65vh";
    dialogConfig.height = "65%";
    dialogConfig.width = "60%";     
   const modalRef =  this.dialog.open(ProductClassAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      if (data != null)
        this.loadData();
    });
}

  ngOnInit() {
    
    this.loadData();  
            
  }
  

  edit (row ) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = row;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '70vw';
    dialogConfig.maxHeight = "70vh";
    dialogConfig.height = "70%";
    dialogConfig.width = "70%";
    const modalRef =  this.dialog.open(ProductClassAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      if (data != null)
        this.loadData();
    });
  }
  
  delete (row) {
    this.confirmDialog(row);
    
  }
  showNotification(cls, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 3000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: ['mat-toolbar', cls]
    });
  }
  confirmDialog(row): void {
    
    const message = `Est-vous sûr de vouloir supprimer cet enregistrement?`;

    const dialogData = new ConfirmDialogModel("Confirmation", message);

    const dialogRef = this.dialog.open(ConfimDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
     if(dialogResult) {
      this.productClassService.deleteProductClass(row.id).subscribe(msg => {
        this.showNotification('mat-primary', "La suppression a été terminée avec succès", 'top', 'right');
        this.loadData();
      }, (error) => {
        this.showNotification('mat-warn', error, 'top', 'right');
        return;
      });
     }
    });
   
  }
  
 
}
