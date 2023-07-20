import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Discount } from '../discounts/discount-models/Discount';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class DiscountService extends BaseService{
  baseURL : string;
  customerUrl : string;

  constructor(private httpClient: HttpClient) { 
    super();
    this.baseURL = environment.ResourceServer.Endpoint +  "discounts";
  }

  get(filter: string, sort: string, page: number, pageSize: number): Observable<Discount[]> {
    return this.httpClient.get<Discount[]>(this.baseURL, {
      params: new HttpParams()
        .set('filter', filter)
        .set('sort', sort)
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
    })
  }
  getActive(productId): Observable<Discount[]> {
    return this.httpClient.get<Discount[]>(this.baseURL+'/active/'+productId);
  }

  add(discount: Discount) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.post(this.baseURL , discount).pipe(catchError(this.handleError) );
  }
  update(discount: Discount) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.put(this.baseURL + "/" + discount.id , discount).pipe(catchError(this.handleError) );
  }
}
