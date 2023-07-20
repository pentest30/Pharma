import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { FormService } from 'src/app/services/form.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { FormAddComponent } from '../form-add/form-add.component';
import { Form } from '../models/form-model';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.sass']
})
export class FormListComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['name', 'actions'];
  dataSource: FormDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private service: FormService, private notif: NotificationHelper, private dialog: MatDialog, private auth: AuthService) {
    super(auth,"forms/") ;

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

  opendDialog() {
    this.createModalDialog({})
  }
  private createModalDialog(item) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = item;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    var modalRef = this.dialog.open(FormAddComponent, dialogConfig);
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
export class FormDataSource extends DataSource<Form> {
  connect(collectionViewer: CollectionViewer): Observable<Form[]> {
    return this.formsSubject.asObservable();
  }

  constructor(private service: FormService) {
    super();
  }
  private formsSubject = new BehaviorSubject<Form[]>([]);

  // to show the total number of records
  private countSubject = new BehaviorSubject<number>(0);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public counter$ = this.countSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();


  
  disconnect(collectionViewer: CollectionViewer): void {
    this.formsSubject.complete();
    this.countSubject.complete();
    this.loadingSubject.complete();
  }

}