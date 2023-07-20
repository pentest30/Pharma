import { Component, OnInit, ViewChild } from '@angular/core';

import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { CollectionViewer } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RoleService } from 'src/app/services/roles.service';
import { Role } from '../../models/user-role';
import { RoleAddComponent } from '../role-add/role-add.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.sass']
})
export class RoleListComponent implements OnInit { displayedColumns: string[] = [  'normalizedName','actions'];
dataSource : RoleDataSource;
@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
@ViewChild(MatSort, { static: true }) sort: MatSort;
  searchTerm: any;
constructor( private service: RoleService,
    private notif: NotificationHelper,
    private dialog: MatDialog) { }

ngOnInit(): void {
  this.loadDataTable("");
} 
openDialog() {
  this.createModalDialog({});

}
private createModalDialog(item) {
  console.log(item);
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data = item;
  dialogConfig.disableClose = false;
  dialogConfig.autoFocus = true;
  var modalRef = this.dialog.open(RoleAddComponent, dialogConfig);
  modalRef.afterClosed().subscribe(data => {
    if (data != null)
      this.loadDataTable("");
  });
}
doFilter(val : any) {
  this.searchTerm = val;
  this.loadDataTable(val);
}
loadDataTable (term : string) {
 this.paginator.pageSize = 10;
 this.dataSource = new RoleDataSource(this.service);
 this.dataSource.loadData(term, '_asc',this.paginator.pageIndex + 1, this.paginator.pageSize);  
}
ngAfterViewInit() {
  this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  this.dataSource.counter$
    .pipe(
       tap((count) => {
          this.paginator.length = count;
       })
    )
    .subscribe();
    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
       tap(() => this.dataSource.loadData('',  this.sort.active + "_" + this.sort.direction, this.paginator.pageIndex + 1, this.paginator.pageSize))
    )
    .subscribe();
}

 edit (row ) {
  this.createModalDialog(row);
 }
 delete (row ) {
    this.confirmDialog(row);
 }
 confirmDialog(row :Role): void {
  
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
        this.loadDataTable("");
      }, (error) => {
        this.notif.showNotification('mat-warn', error, 'top', 'right');
        return;
      });
     }
    });
   
  }

}
export class RoleDataSource implements DataSource<Role> {
// add variables to hold the data and number of total records retrieved asynchronously
// BehaviourSubject type is used for this purpose
private therapeuticClassesSubject = new BehaviorSubject<Role[]>([]);

// to show the total number of records
private countSubject = new BehaviorSubject<number>(0);
private loadingSubject = new BehaviorSubject<boolean>(false);
public counter$ = this.countSubject.asObservable();
public loading$ = this.loadingSubject.asObservable();
constructor(private service: RoleService) {

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

connect(collectionViewer: CollectionViewer): Observable<Role[]> {
   console.log("Connecting data source");
   return this.therapeuticClassesSubject.asObservable();
}

disconnect(collectionViewer: CollectionViewer): void {
   this.therapeuticClassesSubject.complete();
   this.countSubject.complete();
   this.loadingSubject.complete();
}
}