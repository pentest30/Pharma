import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core"; 
import * as uuid from 'uuid';
import { environment } from "src/environments/environment";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { InventSum } from "../inventory/inventsum/models/inventsum-model"; 
import { BaseService } from "../shared/base.service";
import { InventQuota } from "../inventory/inventsum/models/quota-invent";
@Injectable({
  providedIn: 'root'
})
export class InventSumService  extends BaseService  {
  axInventPicking: string;
  axInventPickingUrl: string;
  feed(id: string,value:InventSum) {
    
    
      let header = new HttpHeaders();
      header.append('Content-Type', 'applications/json');
      value.id=id;
      return this.httpCLient.put(this.baseURL + "/feed/" + id , value).pipe(catchError(this.handleError) );
      
  }
  getByDim(value: InventSum): Observable<InventSum> {
    return this.httpCLient.post<InventSum>(this.baseURL + "/bydimension",  value);
  }
  getById(value: string): Observable<InventSum> {
    return this.httpCLient.get<InventSum>(this.baseURL + "/"+value);
  }

  delete(id: string) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    
    return this.httpCLient.delete(this.baseURL + "/" + id  ).pipe(catchError(this.handleError) )
  }
  update(value: InventSum) {
    console.log(value);
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL + "/" + value.id , value).pipe(catchError(this.handleError) );
  } 
  
  baseURL = "";
  constructor(private httpCLient: HttpClient) {
    super();
    this.baseURL = environment.ResourceServer.Endpoint + "inventory/inventsum";
    this.axInventPickingUrl = environment.ResourceServer.InventPickingEndPoint;
  }
  getPickingInventFromAx(data) {
    return this.httpCLient.post(this.axInventPickingUrl, data).pipe(catchError(this.handleError) );
  }
  get(filter: InventSum, sort: string, page: number, pageSize: number): Observable<InventSum[]> {
    return this.httpCLient.post<InventSum[]>(this.baseURL+"/details/"+sort+"/"+page+"/"+pageSize,filter);
  }
  getByProductId(supplierId, productId): Observable<InventSum[]> {
    return this.httpCLient.get<InventSum[]>(this.baseURL+'/'+supplierId+"/"+productId);
  }
  getStockForSalesPerson(supplierId, productId): Observable<InventSum[]> {
    return this.httpCLient.get<InventSum[]>(this.baseURL+'/salesperson/'+supplierId+"/"+productId);
  }
  getAvailableQnt( productId): Observable<number> {
    return this.httpCLient.get<number>(this.baseURL+"/"+productId+"/available-qnt");
  }

  switchState(item : InventSum) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL + "/" + item.organizationId+"/suppliercustomers/"+item.id+"/change-status",null )
    .pipe(catchError(this.handleError) )
  }
  
  post(value: InventSum) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.post(this.baseURL , value).pipe(catchError(this.handleError) );
  }
  getProductsForQuota(supplierId): Observable<InventQuota[]> {
    return this.httpCLient.get<InventQuota[]>(this.baseURL+"/"+supplierId+"/products-for-quota");
  }
  
  getTransactionListing(): Observable<any[]> {
    let url = environment.ResourceServer.Endpoint + "inventory/preparationOrder/search";

    return this.httpCLient.get<any[]>(url);

  }
  getStockForPreparation(supplierId, productCode,zoneName=''): Observable<InventSum[]> {
    return this.httpCLient.get<InventSum[]>(this.baseURL+'/preparation/'+supplierId+"/"+productCode+"/"+zoneName);
  }

}
