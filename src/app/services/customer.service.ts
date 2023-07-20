import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Customer } from '../tiers/customer/models/customer-model';
import * as uuid from 'uuid';
import { BaseService } from '../shared/base.service';
import { CustomerProfile } from '../sales/sales-models/customer-profile';

@Injectable({
  providedIn: 'root'
})
export class CustomerService  extends BaseService {

  delete(id: string) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.delete(this.baseURL + "/" + id  ).pipe(catchError(this.handleError) )
  }
  activate(id: string) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');

    return this.httpCLient.put(this.baseURL + "/" + id  +"/activate" , {}).pipe(catchError(this.handleError) )
  }
  update(value: Customer) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL + "/" + value.id , value).pipe(catchError(this.handleError) );
  }
  updateActualSalesPerson(value: any) {
    let header = new HttpHeaders();
    this.baseURL = environment.ResourceServer.Endpoint + "customers";
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL + "/updateActualSalesPerson"  , value).pipe(catchError(this.handleError) );
  }
  cancelActualSalesPerson(value: any) {
    let header = new HttpHeaders();
    this.baseURL = environment.ResourceServer.Endpoint + "customers";
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL + "/cancelActualSalesPerson"  , value).pipe(catchError(this.handleError) );
  }
  add(value: Customer) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.post(this.baseURL , value).pipe(catchError(this.handleError) );
  }
  getById(item : Customer) : Observable<any>{
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.get(this.baseURL + "/" + item.id ).pipe(catchError(this.handleError) )
  }

  public baseURL = "";
  constructor(private httpCLient: HttpClient) {
    super();
    this.baseURL = environment.ResourceServer.Endpoint + "organizations";
  }
  get(filter: string, sort: string, page: number, pageSize: number): Observable<Customer[]> {
    return this.httpCLient.get<Customer[]>(this.baseURL, {
      params: new HttpParams()
        .set('term', filter)
        .set('sort', sort)
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
    })
  }
  getAll(): Observable<Customer[]> {
    return this.httpCLient.get<Customer[]>(this.baseURL + "/getAll");
  }
  potentialCustomersBySupplier(): Observable<Customer[]> {
    return this.httpCLient.get<Customer[]>(this.baseURL + "/potentials");
  }
  customerBySalesPerson(): Observable<Customer[]> {
    this.baseURL = environment.ResourceServer.Endpoint + "customers";
    return this.httpCLient.get<Customer[]>(this.baseURL + "/salesperson/" );
  }
  customerBySalesPersonById(id : string): Observable<Customer[]> {
    this.baseURL = environment.ResourceServer.Endpoint + "customers";
    return this.httpCLient.get<Customer[]>(this.baseURL +"/"+id+"/salesperson/" );
  }
  customerByForSupervisor(id : string): Observable<any[]> {
    this.baseURL = environment.ResourceServer.Endpoint + "customers";
    return this.httpCLient.get<any[]>(this.baseURL +"/"+id+"/supervisor/search" );
  }
  getListCustomerBySalesPerson(code , name): Observable<CustomerProfile[]> {
    this.baseURL = environment.ResourceServer.Endpoint + "customers";
    return this.httpCLient.get<CustomerProfile[]>(this.baseURL + "/salesperson/" + code +"/" + name);
  }
  getCustomerByOrganizationId(organizationId): Observable<Customer> {
    this.baseURL = environment.ResourceServer.Endpoint + "customer";
    return this.httpCLient.get<Customer>(this.baseURL + "/organization/"+ organizationId);
  }
  getCustomerByIdForSalesPerson(id : string): Observable<Customer> {
    this.baseURL = environment.ResourceServer.Endpoint ;
    return this.httpCLient.get<Customer>(this.baseURL +"customers/"+ id + "/salesperson/get");
  }
  GetCustomerBySalesPersonDash(): Observable<any> {
    this.baseURL = environment.ResourceServer.Endpoint ;
    return this.httpCLient.get<any>(this.baseURL +"customers/salesperson/dash");
  }
  getById2(id) : Observable<any>{
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.get(this.baseURL + "/" + id ).pipe(catchError(this.handleError) )
  }
  GetTodayDashboard(): Observable<any> {
    this.baseURL = environment.ResourceServer.Endpoint ;
    return this.httpCLient.get<any>(this.baseURL +"customers/salesperson/today-dash");
  }
  
  GetMonthlyDashboard(): Observable<any> {
    this.baseURL = environment.ResourceServer.Endpoint ;
    return this.httpCLient.get<any>(this.baseURL +"customers/salesperson/monthly-dash");
  }
}
