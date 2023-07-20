import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, merge, of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { DciCodeService } from 'src/app/services/dci-code.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { DciCodeAddComponent } from '../dci-code-add/dci-code-add.component';
import { DciCode } from '../dci-code-models/dci-code';

@Component({
  selector: 'app-dci-code-list',
  templateUrl: './dci-code-list.component.html',
  styleUrls: ['./dci-code-list.component.sass']
})
export class DciCodeListComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['name', 'formName', 'actions'];
  dataSource:DciCodeDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private service: DciCodeService, private notif: NotificationHelper, private dialog: MatDialog, private auth : AuthService) {
    super(auth,"innCodes/") ;

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
    var modalRef = this.dialog.open(DciCodeAddComponent, dialogConfig);
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
export class DciCodeDataSource extends DataSource<DciCode> {
  connect(collectionViewer: CollectionViewer): Observable<DciCode[]> {
    return this.formsSubject.asObservable();
  }

  constructor(private service: DciCodeService) {
    super();
  }
  private formsSubject = new BehaviorSubject<DciCode[]>([]);

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
