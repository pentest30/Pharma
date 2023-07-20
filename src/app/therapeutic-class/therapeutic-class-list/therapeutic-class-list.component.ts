
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TherapeuticClassService } from 'src/app/services/therapeutic-class-service';
import { ITherapeuticClass } from 'src/app/services/interfaces/therapeutic-class';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TherapeuticClassAddComponent } from '../therapeutic-class-add/therapeutic-class-add.component';
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-therapeutic-class-list',
  templateUrl: './therapeutic-class-list.component.html',
  styleUrls: ['./therapeutic-class-list.component.sass']
})
export class TherapeuticClassListComponent extends BaseComponent implements OnInit  {
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private service : TherapeuticClassService, 
   private dialog: MatDialog, 
   private snackBar : MatSnackBar, 
   private notifHelper : NotificationHelper, private auth : AuthService) { 
   super(auth, "therapeuticClass/");
  }

  ngOnInit(): void {
   this.loadData();
  
  }
  dataChanged (form : ITherapeuticClass) {
     console.log(form);
  }
 
  
  openDialog() {
       this.createModalDialog( {});
}

   private createModalDialog( item) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = item;
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      const modalRef = this.dialog.open(TherapeuticClassAddComponent, dialogConfig);
      modalRef.afterClosed().subscribe(data => {
         if (data != null)
           this.loadData();
       });
   }

  edit (row) {
   this.createModalDialog (row);
  }
  delete (row) {
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
    if(dialogResult) {
     this.service.deleteTherapeuticClass(row.id).subscribe(msg => {
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


