import { Component, OnInit } from '@angular/core';
import { Observable, Subject, concat, of, throwError } from 'rxjs';
import { filter, distinctUntilChanged, debounceTime, tap, switchMap, catchError, map } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.sass']
})
export class CustomSelectComponent implements OnInit {
  products$: Observable<any>;
  productsLoading = false;
  productsInput$ = new Subject<string>();
  selectedMovie: any;
  minLengthTerm = 3;
  isPsy;
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
  }
  loadProducts() {
    this.products$ = concat(
      of([]), // default items
      this.productsInput$.pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(100),
        tap(() => this.productsLoading = true),
        switchMap(term => {

          return this.getProducts(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => this.productsLoading = false)
          )
        })
      )
    );

  }
  getProducts(term: string = null): Observable<any> {
    return this.productService
      .getAllByName( term, this.isPsy)
      .pipe(map(resp => {
        if (!resp) {
          throwError(resp);
        } else {
          return resp;
        }
      })
      );
  }
  onProductBlurSelection(event) {
  }
  onClearSelection() {
    
  }
  async onProductSelection(selectedProduct) {
    
   
  }
  async onKeyDown(event) {
   
   }
}
