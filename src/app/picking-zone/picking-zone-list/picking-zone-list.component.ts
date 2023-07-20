import { PickingZone } from './../models/picking-zeone';
import { DataSource } from '@angular/cdk/table';
import { PickingZoneAddComponent } from './../picking-zone-add/picking-zone-add.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PickingZoneService } from 'src/app/services/piking-zone.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-picking-zone-list',
  templateUrl: './picking-zone-list.component.html',
  styleUrls: ['./picking-zone-list.component.sass']
})
export class PickingZoneListComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['name','order','groupName', 'actions'];

  dataSource: PickingZoneDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private service: PickingZoneService, private dialog: MatDialog,  private notifHelper: NotificationHelper, private auth:AuthService) {
    super(auth,"pickingZones/") ;

   }

  ngOnInit(): void {
    this.loadData();
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {  };
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    var modalRef = this.dialog.open(PickingZoneAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      if (data != null)
        this.loadData();
    });
  }
  edit(row) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = { 
      modalTitle: 'Modifier ', 
      id: row.id, 
      name: row.name,zoneGroupId: (row.zoneGroupId) ? row.zoneGroupId : null, 
      order: row.order, 
      zoneType: row.zoneType,
      description: row.description 
    };
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    var modalRef =this.dialog.open(PickingZoneAddComponent, dialogConfig);
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
export class PickingZoneDataSource extends DataSource<PickingZone> {
  connect(collectionViewer: CollectionViewer): Observable<PickingZone[]> {
    return this.formsSubject.asObservable();
  }

  constructor(private service: PickingZoneService) {
    super();
  }
  private formsSubject = new BehaviorSubject<PickingZone[]>([]);

  // to show the total number of records
  private countSubject = new BehaviorSubject<number>(0);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public counter$ = this.countSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();


  loadData(filter: string, sortDirection: string, pageIndex: number, pageSize: number) {
    this.loadingSubject.next(true);
    // use pipe operator to chain functions with Observable type
    this.service.get(filter, sortDirection, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
        //finalize()
      )
      // subscribe method to receive Observable type data when it is ready
      .subscribe((result: any) => {
        this.formsSubject.next(result.data);
        this.countSubject.next(result.total);
      }
      );
  }



  disconnect(collectionViewer: CollectionViewer): void {
    this.formsSubject.complete();
    this.countSubject.complete();
    this.loadingSubject.complete();
  }

}