import { PharmacologicalService } from 'src/app/services/pharmacological-class.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PharmacologicalClassAddComponent } from '../pharmacological-class-add/pharmacological-class-add.component';
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-pharmacological-class-list',
  templateUrl: './pharmacological-class-list.component.html',
  styleUrls: ['./pharmacological-class-list.component.sass']
})
export class PharmacologicalClassListComponent extends BaseComponent implements OnInit {
  
 @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private service: PharmacologicalService, 
    private dialog: MatDialog, 
    private snackBar: MatSnackBar, 
    private notifHelper: NotificationHelper, private auth :AuthService) {
    super(auth, "pharmacologicalClass/");
   }

  ngOnInit(): void {
    this.loadData();
  }

 
  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = { modalTitle: 'Nouvelle classe pharmacologique' };
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    var modalRef = this.dialog.open(PharmacologicalClassAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      if (data != null)
        this.loadData();
    });
  }
  edit(row) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = { modalTitle: 'Modifier ', id: row.id, name: row.name, description: row.description };
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    var modalRef =this.dialog.open(PharmacologicalClassAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      if (data != null)
        this.loadData();
    });
  }
  delete(row) {
    this.confirmDialog(row);
  }
  confirmDialog(row): void {

    const message = `Est-vous sûr de vouloir supprimer cet enregistrement?`;

    const dialogData = new ConfirmDialogModel("Confirmation", message);

    const dialogRef = this.dialog.open(ConfimDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
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


