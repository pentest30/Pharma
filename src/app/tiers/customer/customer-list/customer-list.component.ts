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
import { CustomerService } from 'src/app/services/customer.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { Customer } from '../models/customer-model';
import { environment } from "src/environments/environment";
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { AuthService } from 'src/app/services/auth.service';
import { loadCldr, setCulture } from '@syncfusion/ej2-base';
@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.sass']
})
export class CustomerListComponent implements OnInit {

  displayedColumns: string[] = [ 'name', 'nis', 'nif','rc','activity','establishmentDate','organizationState', 'actions'];
  dataSource : ManufacturerDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  searchTerm: any;
  data  : DataManager;
  gridLines: string;
  constructor( private route: Router, private service: CustomerService,  private notif: NotificationHelper,private dialog: MatDialog, private authService :AuthService ) { 
    setCulture('fr');
    
  }

  ngOnInit(): void {
    this.gridLines = "Both";
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "organizations/search",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.authService.getToken }],
    });
    //this.loadDataTable("");
  } 
  doFilter(val : any) {
    this.searchTerm = val;
    this.loadDataTable(val);
  }
  loadDataTable (term :string) {
   this.paginator.pageSize = 10;
   this.dataSource = new ManufacturerDataSource(this.service);
   this.dataSource.loadData(term, '_asc',this.paginator.pageIndex + 1, this.paginator.pageSize);  
  }
  ngAfterViewInit() {
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    // this.dataSource.counter$
    //   .pipe(
    //      tap((count) => {
    //         this.paginator.length = count;
    //      })
    //   )
    //   .subscribe();
    //   merge(this.sort.sortChange, this.paginator.page)
    //   .pipe(
    //      tap(() => this.dataSource.loadData('',  this.sort.active + "_" + this.sort.direction, this.paginator.pageIndex + 1, this.paginator.pageSize))
    //   )
    //   .subscribe();
  }
  
   edit (row ) {
     console.log(row);
     var customer = new Customer();
     customer.id = row.id;
     customer.name = row.name;
     customer.nif = row.nif;
     customer.nis = row.nis;
     customer.ai = row.ai;
     customer.establishmentDate = row.establishmentDate;
     customer.organizationState = row.organizationState;
     customer.organizationActivity = row.organizationActivity;
     customer.activity = row.activity;
     customer.addresses = row.addresses;
     customer.phoneNumbers = row.phoneNumbers;
     customer.emails = row.emails;
     customer.eCommerce = row.eCommerce;


    this.route.navigate(['/tiers/customer/customer-edit/'], { state: { customer: customer } });
   }
   delete (row ) {
      this.confirmDialog(row);
   }
   activate(row) {
    this.service.activate(row.id).subscribe(msg => {
      this.notif.showNotification('mat-primary', "L'activation est terminée avec succès", 'top', 'right');
      this.data = new DataManager({
        url: environment.ResourceServer.Endpoint + "organizations/search",
        adaptor: new UrlAdaptor(),
        headers: [{ Authorization: "Bearer " + this.authService.getToken }],
      });
    }, (error) => {
      this.notif.showNotification('mat-warn', error, 'top', 'right');
      return;
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
          this.data = new DataManager({
            url: environment.ResourceServer.Endpoint + "organizations/search",
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
export class ManufacturerDataSource implements DataSource<Customer> {
  // add variables to hold the data and number of total records retrieved asynchronously
  // BehaviourSubject type is used for this purpose
  private therapeuticClassesSubject = new BehaviorSubject<Customer[]>([]);

  // to show the total number of records
  private countSubject = new BehaviorSubject<number>(0);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public counter$ = this.countSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  constructor(private service: CustomerService) {
  
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
  
  connect(collectionViewer: CollectionViewer): Observable<Customer[]> {
     console.log("Connecting data source");
     return this.therapeuticClassesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
     this.therapeuticClassesSubject.complete();
     this.countSubject.complete();
     this.loadingSubject.complete();
  }
}
