import { TaxGroupService } from './../../services/tax-group.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { TaxGroup } from '../models/tax-group';
import { catchError, finalize, tap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { TaxGroupAddComponent } from '../tax-group-add/tax-group-add.component';
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-tax-group-list',
  templateUrl: './tax-group-list.component.html',
  styleUrls: ['./tax-group-list.component.sass']
})
export class TaxGroupListComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = [ 'name', 'code', 'taxValue','validFrom','validTo','actions'];
  dataSource: TaxGroupDataSource;
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private service  : TaxGroupService, private dialog: MatDialog, private snackBar : MatSnackBar, private notifHelper : NotificationHelper, private auth: AuthService) {
    super(auth,"taxGroups/") ;
   }
  openDialog() {
    this.createModalDialog({});
 }
  ngOnInit(): void {
    this.loadData();
  }
  private createModalDialog( item) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = item;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    var modalRef = this.dialog.open(TaxGroupAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      if(data!=null)
        this.loadData();
    });
 }
 
  edit (row) {
    console.log(row)
    this.createModalDialog (row);
   }
   delete (row) {
      this.confirmDialog(row);
   }
  loadDataTable() {
    this.paginator.pageSize = 10;
    this.dataSource = new TaxGroupDataSource(this.service);
    this.dataSource.loadData('', '_asc',this.paginator.pageIndex + 1, this.paginator.pageSize);  
   }
   confirmDialog(row): void {
    
    const message = 'Est-vous sûr de vouloir supprimer ' + row.name;
 
    const dialogData = new ConfirmDialogModel("Confirmation", message);
 
    const dialogRef = this.dialog.open(ConfimDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
 
    dialogRef.afterClosed().subscribe(dialogResult => {
     if(dialogResult) {
      this.service.deleteTaxGroup(row.id).subscribe(msg => {
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
export class TaxGroupDataSource implements DataSource<TaxGroup> {
  private taxGroupSubject = new BehaviorSubject<TaxGroup[]>([]);

  // to show the total number of records
  private countSubject = new BehaviorSubject<number>(0);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public counter$ = this.countSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  constructor(private service: TaxGroupService) {
  
  }
  
  loadData(filter: string,sortDirection: string,  pageIndex: number, pageSize: number) {
    this.loadingSubject.next(true);
     // use pipe operator to chain functions with Observable type
     this.service.getTaxGroups(filter, sortDirection, pageIndex, pageSize)
     .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
        //finalize()
     )
     // subscribe method to receive Observable type data when it is ready
     .subscribe((result : any) => {
        this.taxGroupSubject.next(result.data);
        this.countSubject.next(result.total);
       }
     );
  }
  
  connect(collectionViewer: CollectionViewer): Observable<TaxGroup[]> {
     console.log("Connecting data source");
     return this.taxGroupSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
     this.taxGroupSubject.complete();
     this.countSubject.complete();
     this.loadingSubject.complete();
  }

}