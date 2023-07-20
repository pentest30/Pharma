import { ManufacturerService } from 'src/app/services/manufacturer.service';

import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-manufacturer-list',
  templateUrl: './manufacturer-list.component.html',
  styleUrls: ['./manufacturer-list.component.sass']
})
export class ManufacturerListComponent extends BaseComponent implements OnInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor( private route: Router, private service: ManufacturerService,  private notif: NotificationHelper,private dialog: MatDialog, private auth: AuthService) 
  {
    super(auth,"manufacturers/") ;
  }

  ngOnInit(): void {
    this.loadData();
   
  } 
 
 
  
   edit (row ) {
     console.log(row);
    
    this.route.navigate(['/manufacturer/manufacturer-edit/'], { state: { manufacturer: row } });
   }
   delete (row ) {
      this.confirmDialog(row);
   }
   confirmDialog(row): void {
    
      const message = 'Est-vous sûr de vouloir supprimer ' + row.name + '?';
  
      const dialogData = new ConfirmDialogModel("Confirmation", message);
  
      const dialogRef = this.dialog.open(ConfimDialogComponent, {
        maxWidth: "400px",
        data: dialogData
      });
  
      dialogRef.afterClosed().subscribe(dialogResult => {
       if(dialogResult) {
        this.service.deleteManufacturer(row.id).subscribe(msg => {
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
