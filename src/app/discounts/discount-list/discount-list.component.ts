import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommandClickEventArgs, CommandModel, EditSettingsModel, GridComponent } from '@syncfusion/ej2-angular-grids';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { DiscountService } from 'src/app/services/discount.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { AddDiscountComponent } from '../add-discount/add-discount.component';
import { Discount } from '../discount-models/Discount';
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';

@Component({
  selector: 'app-discount-list',
  templateUrl: './discount-list.component.html',
  styleUrls: ['./discount-list.component.sass']
})
export class DiscountListComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['product','thresholdQuantity','discountRate','from','to', 'actions'];
  dataSource:DiscountDataSource;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('grid') public grid: GridComponent;
  public data: DataManager;
  gridLines: string;
  public editSettings: EditSettingsModel;
  public commandListing: CommandModel[];

  constructor(
    private service: DiscountService, 
    private notif: NotificationHelper, 
    private _auth: AuthService,
    private dialog: MatDialog) {
    super(_auth,"discounts/");
      this.commandListing = [
       { type: 'None',title:'Editer', buttonOption: { iconCss: 'e-icons e-edit', cssClass: 'e-flat'} },
     ];
    }


  ngOnInit(): void {
    this.loadData();
  }
  public onStrtChange(e) {
     
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "discounts/search",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this._auth.getToken }],
      
    });
    
  }
 
  openDialog() {
    this.createModalDialog({
      operation: 1
    })
  }
  edit(row) {
    this.createModalDialog({
      element: row,
      operation: 2
    });
  }
  private createModalDialog(item) {
    console.log(item);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = item;
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.autoFocus = true;
    dialogConfig.width = "450px";
    var modalRef = this.dialog.open(AddDiscountComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
      if (data != null)
        this.loadData();
    });
  }
  ListingCommandClick(args: CommandClickEventArgs): void {
    if(args.commandColumn.title == 'Editer') this.edit(args.rowData);
  }
  public dataBound(e) {
    this.grid.autoFitColumns();

  }

}
export class DiscountDataSource extends DataSource<Discount>{
 
  connect(collectionViewer: CollectionViewer): Observable<Discount[]> {
    return this.formsSubject.asObservable();
  }

  constructor(private service: DiscountService) {
    super();
  }
  private formsSubject = new BehaviorSubject<Discount[]>([]);

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
