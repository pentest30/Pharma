import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { UrlAdaptor } from '@syncfusion/ej2-data';
import { environment } from './../../../../environments/environment';
import { DataManager } from '@syncfusion/ej2-data';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import { SupplierService } from 'src/app/services/supplier.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { Supplier } from '../models/supplier-model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.sass']
})
export class SupplierListComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = [ 'name','activity','establishmentDate','rc', 'nif','ai', 'nis', 'organizationStatus'];
  customerState: string[] = ["Actif","Bloqué"];
  activity: string[]= ["Médecin","Hôpital","Officine","Répartiteur"];
  dataSource : GridComponent;
  @ViewChild('grid') public grid: GridComponent;
  searchTerm: any;
  public data: DataManager;
  constructor( private route: Router, private service: SupplierService,  private notif: NotificationHelper,private dialog: MatDialog, private authService: AuthService) {
    super(authService, 'suppliers/')
   }

  ngOnInit(): void {
    this.gridLines = "Both";
    this.selectionOptions = { checkboxMode: 'ResetOnRowClick'};
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "suppliers" + "/post" ,
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.authService.getToken }],
    });
    console.log(this.data);
  }



  add () {
    this.route.navigate(['/tiers/customer/customer-add/'], { state: { isSupplier: true } });
  }

   edit (row ) {
     console.log(row);

    this.route.navigate(['/tiers/supplier/supplier-edit/'], { state: { manufacturer: row } });
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
        this.service.delete(row.id).subscribe(msg => {
          this.notif.showNotification('mat-primary', "La suppression a été terminée avec succès", 'top', 'right');
          this.data = new DataManager({
            url: environment.ResourceServer.Endpoint + "suppliers" + "/post",
            adaptor: new UrlAdaptor(),
            headers: [{ Authorization: "Bearer " + this.authService.getToken }],
          });
        }, (error) => {
          this.notif.showNotification('mat-warn', error, 'top', 'right');
          return;
        });
       }
      });

    }

}
