import { CollectionViewer } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import { BrandService } from 'src/app/services/brand.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { BrandAddComponent } from '../brand-add/brand-add.component';
import { Brand } from '../models/brand-model';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.sass']
})
export class BrandListComponent  extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['name', 'actions'];
 
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private service: BrandService, private notif: NotificationHelper, private dialog: MatDialog, private auth : AuthService) { 
    super(auth, "brands/")
  }


  ngOnInit(): void {
    this.loadData();
  }
  delete(row) {
    this.confirmDialog(row);
  }
  edit(row) {
    this.createModalDialog(row);
  }
 
  openDialog() {
    this.createModalDialog({})
  }
  private createModalDialog(item) {
    console.log(item);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = item;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    var modalRef = this.dialog.open(BrandAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      if (data != null)
        this.loadData();
    });
  }

  confirmDialog(row): void {

    const message = 'Est-vous sûr de vouloir supprimer ' + row.name + '?';

    const dialogData = new ConfirmDialogModel("Confirmation", message);

    const dialogRef = this.dialog.open(ConfimDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.service.delete(row.id).subscribe(msg => {
          this.notif.showNotification('mat-primary', "La suppression a été terminée avec succès", 'top', 'right');
          this.loadData();
        }, (error) => {
          this.notif.showNotification('mat-warn', error, 'top', 'right');
          return;
        });
      }
    });

  }


}

