import { ProductClassService } from './product-class.service';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ProductClass } from '../models/product-class-model';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';

export class ProductCLassDataSource implements DataSource<ProductClass> {
    // add variables to hold the data and number of total records retrieved asynchronously
    // BehaviourSubject type is used for this purpose
    private productClassesSubject = new BehaviorSubject<ProductClass[]>([]);
  
    // to show the total number of records
    private countSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public counter$ = this.countSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    constructor(private productclassService: ProductClassService) {
    
    }
    
    loadData(filter: string,sortDirection: string,  pageIndex: number, pageSize: number) {
      this.loadingSubject.next(true);
       // use pipe operator to chain functions with Observable type
       this.productclassService.getProductClasses(filter, sortDirection, pageIndex, pageSize)
       .pipe(
          catchError(() => of([])),
          finalize(() => this.loadingSubject.next(false))
          //finalize()
       )
       // subscribe method to receive Observable type data when it is ready
       .subscribe((result : any) => {
          this.productClassesSubject.next(result.data);
          this.countSubject.next(result.total);
         }
       );
    }
    
    connect(collectionViewer: CollectionViewer): Observable<ProductClass[]> {
       console.log("Connecting data source");
       return this.productClassesSubject.asObservable();
    }
  
    disconnect(collectionViewer: CollectionViewer): void {
       this.productClassesSubject.complete();
       this.countSubject.complete();
       this.loadingSubject.complete();
    }
 }
 