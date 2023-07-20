import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as uuid from 'uuid';
import { Product } from '../product/prodcut-models/product';
import { BaseService } from '../shared/base.service';
@Injectable({
  providedIn: 'root'
})
export class ProductService  extends BaseService{
  private messageSource = new BehaviorSubject([]);
  currentMessage = this.messageSource.asObservable();
  delete(item : Product) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');

    return this.httpCLient.delete(this.baseURL + "/" + item.productClassId+ "/products/" + item.id  ).pipe(catchError(this.handleError) )
  }
  validate(item : Product) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');

    return this.httpCLient.put(this.baseURL + "/" + item.productClassId+ "/products/" + item.id + "/validate" , null ).pipe(catchError(this.handleError) )
  }
  disable(item : Product) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');

    return this.httpCLient.put(this.baseURL + "/" + item.productClassId+ "/products/" + item.id + "/disable" , null ).pipe(catchError(this.handleError) )
  }
  enable(item : Product) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');

    return this.httpCLient.put(this.baseURL + "/" + item.productClassId+ "/products/" + item.id + "/enable" , null ).pipe(catchError(this.handleError) )
  }
  hasQuota(item : Product) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');

    return this.httpCLient.put(this.baseURL + "/" + item.productClassId+ "/products/" + item.id + "/hasQuota" , null ).pipe(catchError(this.handleError) )
  }
  deleteQuota(item : Product) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');

    return this.httpCLient.put(this.baseURL + "/" + item.productClassId+ "/products/" + item.id + "/removeQuota" , null ).pipe(catchError(this.handleError) )
  }
  getById(item : Product) : Observable<any>{
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.get(this.baseURL + "/" + item.productClassId+ "/products/" + item.id +"/get" ).pipe(catchError(this.handleError) )
  }
  update(item: Product) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL + "/" + item.productClassId+ "/products/" + item.id , item).pipe(catchError(this.handleError) );
  }
  add(value: Product) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    value.id = uuid.v4();
    return this.httpCLient.post(this.baseURL + "/"+value.productClassId  + "/products/" , value).pipe(catchError(this.handleError) );
  }

  baseURL = "";
  constructor(private httpCLient: HttpClient)  {
    super();
    this.baseURL = environment.ResourceServer.Endpoint + "catalog";
  }
  get(filter: string, sort: string, page: number, pageSize: number): Observable<Product[]> {
    return this.httpCLient.get<Product[]>(this.baseURL + "/products/", {
      params: new HttpParams()
        .set('term', filter)
        .set('sort', sort)
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
    })
  }
  getProductsQuota(): Observable<Product[]> {
   return this.httpCLient.get<Product[]>(this.baseURL+"/products/quota");
  }
  getAll(): Observable<Product[]> {
    return this.httpCLient.get<Product[]>(this.baseURL+"/products/getall");


   }
   getAllByName(term : string, psyc : boolean ): Observable<Product[]> {
    if(psyc == null) 
    return this.httpCLient.get<Product[]>(this.baseURL+"/products/sales-person",  {headers : {"term": term}});
    else
    return this.httpCLient.get<Product[]>(this.baseURL+"/products/sales-person",  {headers : {"term": term,"isPsy": psyc.toString()}});

   }
  getLastCode(): Observable<string> {
    return this.httpCLient.get<string>(this.baseURL+"/products/last-code");


   }
  async setProductStore () {
    let response = await this.httpCLient.get<Product[]>(this.baseURL+"/products/sales-person").toPromise();
    return response;
    // await this.dbService.clear('products');
    // this.dbService.add("products",response).then(
    //   people => {
    //   },
    //   error => {
    //       console.log(error);
    //   }
    // );
    // this.messageSource.next(response)
  }
  productIsQuota(id) {
    return this.httpCLient.get<any>(environment.ResourceServer.Endpoint +"products/" + id+"/isQuota");

  }
  getTaxProduct(id) {
    return this.httpCLient.get<any>(environment.ResourceServer.Endpoint +"products/" + id+"/tax");

  }
  getAllBySupplier(supplierId,filter: string, productId:string,page: number, pageSize: number): Observable<Product[]> {

    return this.httpCLient.get<Product[]>(this.baseURL+"/products/"+supplierId +"/b2b-customer",{
      params: new HttpParams()
        .set('term', filter)
        .set('productId', productId)
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())

    });
  }

}
