import { UrlAdaptor } from '@syncfusion/ej2-data';
import { environment } from './../../../../environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { DataManager } from '@syncfusion/ej2-data';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import { SectorService } from 'src/app/services/sector.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { Sector } from '../models/sector';
import { SectorAddComponent } from '../sector-add/sector-add.component';

@Component({
  selector: 'app-sector-list',
  templateUrl: './sector-list.component.html',
  styleUrls: ['./sector-list.component.sass']
})
export class SectorListComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = [ 'name', 'code','organization', 'actions'];
  dataSource : ManufacturerDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  searchTerm: any;
  data: DataManager;
  constructor( private route: Router, private service: SectorService,  private notif: NotificationHelper,private dialog: MatDialog, private authService: AuthService) {
    super(authService, 'sectors/')
   }

  ngOnInit(): void {
    this.gridLines = "Both";
    this.selectionOptions = { checkboxMode: 'ResetOnRowClick'};
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "sectors/" + "search",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.authService.getToken }],
    });  }
  doFilter(val : any) {
    this.searchTerm = val;
    this.loadDataTable(val);
  }
  loadDataTable (term :string) {
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "sectors/" + "search",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.authService.getToken }],
    });
  }

   edit (row ) {
    this.createModalDialog(row);
   }
   delete (row ) {
      this.confirmDialog(row);
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
    var modalRef = this.dialog.open(SectorAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      if (data != null)
      this.loadDataTable("");
    });
  }
   confirmDialog(row): void {

      const message = 'Est-vous sûr de vouloir bloquer ' + row.name + '?';

      const dialogData = new ConfirmDialogModel("Confirmation", message);

      const dialogRef = this.dialog.open(ConfimDialogComponent, {
        maxWidth: "400px",
        data: dialogData
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
       if(dialogResult) {
        this.service.delete(row.id).subscribe(msg => {
          this.notif.showNotification('mat-primary', "La suppression a été terminée avec succès", 'top', 'right');
          this.loadDataTable('');
        }, (error) => {
          this.notif.showNotification('mat-warn', error, 'top', 'right');
          return;
        });
       }
      });

    }

}
export class ManufacturerDataSource implements DataSource<Sector> {
  // add variables to hold the data and number of total records retrieved asynchronously
  // BehaviourSubject type is used for this purpose
  private therapeuticClassesSubject = new BehaviorSubject<Sector[]>([]);

  // to show the total number of records
  private countSubject = new BehaviorSubject<number>(0);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public counter$ = this.countSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  constructor(private service: SectorService) {

  }

  loadData(filter: string,sortDirection: string,  pageIndex: number, pageSize: number) {
    this.loadingSubject.next(true);
     // use pipe operator to chain functions with Observable type
     this.service.get(filter, sortDirection, pageIndex, pageSize)
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

  connect(collectionViewer: CollectionViewer): Observable<Sector[]> {
     console.log("Connecting data source");
     return this.therapeuticClassesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
     this.therapeuticClassesSubject.complete();
     this.countSubject.complete();
     this.loadingSubject.complete();
  }

}
