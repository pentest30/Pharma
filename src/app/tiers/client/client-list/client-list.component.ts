import { BaseComponent } from './../../../shared/BaseComponent';
import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { GridComponent, SelectionSettingsModel, SortSettings } from '@syncfusion/ej2-angular-grids';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import { ClientService } from 'src/app/services/client.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { ClientAddComponent } from '../client-add/client-add.component';
import { Client } from '../models/client-model';
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { environment } from "src/environments/environment";
import { AuthService } from 'src/app/services/auth.service';
import { ClientDetailComponent } from '../client-detail/client-detail.component';
@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.sass']
})
export class ClientListComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = [ 'code', 'organizationName','onlineCustomer','isPickUpLocation','deliveryTypeDescription', 'quotaEligibility','organizationStatus', 'dept', 'limitCredit', 'paymentMode','actions'];
  dataSource : ManufacturerDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  searchTerm: any;
  gridLines: any;
  selectedrowindex: number;
  previousSelection: any;
  selectionOptions: SelectionSettingsModel;
  sortSettings : SortSettings;
  searchActive: boolean = false;
  public paymentMode: string[] = ["Transfert", "Chèque", "Carte de crédit", "Virement/Versement","Traite", "Espèce"];
  public customerState : string[] = ["Actif", "Bloqué"];
  @ViewChild("grid")
  public grid: GridComponent;
  public data: DataManager;
  constructor( private route: Router,
     private service: ClientService,
      private notif: NotificationHelper,
      private dialog: MatDialog,
      private authService : AuthService)
  {
    super(authService, 'customers/');
  }

   public dataBound(e) {
   // this.grid.autoFitColumns();
    // here we are selecting the row after the refresh Complete
    this.grid.selectRow(0);
    //this.grid.autoFitColumns();

  }
  ngOnInit(): void {
    this.gridLines = "Both";
    this.selectionOptions = { checkboxMode: 'ResetOnRowClick'};
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "customers" + "/salesperson/post",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.authService.getToken }],
    });
  }

  private createModalDialog( item) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = item;
    console.log(item);
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '75%';
    dialogConfig.maxHeight = "90vh"
    var modalRef = this.dialog.open(ClientAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      if(data!=null)
      this.data = new DataManager({
        url: environment.ResourceServer.Endpoint + "customers" + "/salesperson/post",
        adaptor: new UrlAdaptor(),
        headers: [{ Authorization: "Bearer " + this.authService.getToken }],
      });
    });
 }
  edit (row ) {
     var customer = new Client();
     customer.id = row.id;
     customer.organizationId = row.organizationId;
    this.service.getById(customer).subscribe(resp=>

        {
          console.log(resp)
          this.createModalDialog(resp);
        })
   }
   view (row ) {
    var customer = new Client();
    customer.id = row.id;
    customer.organizationId = row.organizationId;
   this.service.getById(customer).subscribe(resp=>

       {
         console.log(resp)
         const dialogConfig = new MatDialogConfig();
          dialogConfig.data = resp;
          dialogConfig.disableClose = false;
          dialogConfig.autoFocus = true;
          dialogConfig.width = '75%';
          dialogConfig.maxHeight = "90vh"
          var modalRef = this.dialog.open(ClientDetailComponent, dialogConfig);

       })
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
            url: environment.ResourceServer.Endpoint + "customers" + "/salesperson/post",
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
    assignClient() {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {};

      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      const modalRef = this.dialog.open(ClientAddComponent, dialogConfig);
      modalRef.afterClosed().subscribe(data => {
        console.log(data);
        if(data!=null)
         this.data = new DataManager({
          url: environment.ResourceServer.Endpoint + "customers" + "/salesperson/post",
          adaptor: new UrlAdaptor(),
          headers: [{ Authorization: "Bearer " + this.authService.getToken }],
        });
      });
    }

}
export class ManufacturerDataSource implements DataSource<Client> {
  // add variables to hold the data and number of total records retrieved asynchronously
  // BehaviourSubject type is used for this purpose
  private therapeuticClassesSubject = new BehaviorSubject<Client[]>([]);

  // to show the total number of records
  private countSubject = new BehaviorSubject<number>(0);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public counter$ = this.countSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  constructor(private service: ClientService) {

  }

  loadData(filter: string,sortDirection: string,  pageIndex: number, pageSize: number) {
    this.loadingSubject.next(true);
     // use pipe operator to chain functions with Observable type
     this.service.get(filter,sortDirection,pageIndex,pageSize)
     .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
        //finalize()
     )
     // subscribe method to receive Observable type data when it is ready
     .subscribe((result : any) => {
        this.therapeuticClassesSubject.next(result.data);
        this.countSubject.next(result.total);
       }
     );
  }

  connect(collectionViewer: CollectionViewer): Observable<Client[]> {
     console.log("Connecting data source");
     return this.therapeuticClassesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
     this.therapeuticClassesSubject.complete();
     this.countSubject.complete();
     this.loadingSubject.complete();
  }

}
