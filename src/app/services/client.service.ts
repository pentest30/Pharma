import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Client } from '../tiers/client/models/client-model';
import * as uuid from 'uuid';
import { Customer } from '../tiers/customer/models/customer-model';
import { ProductClass } from '../product-class/models/product-class-model';
@Injectable({
  providedIn: 'root'
})
export class ClientService {


  delete(id: string) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    
    return this.httpCLient.delete(this.baseURL + "/" + id  ).pipe(catchError(this.handleError) )
  }
  update(value: Client) {
    console.log(value);
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL + "/" + value.id , value).pipe(catchError(this.handleError) );
  }
  add(value: Client) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    value.id = uuid.v4();
    return this.httpCLient.post(this.baseURL , value).pipe(catchError(this.handleError) );
  }
  
  baseURL = "";
  constructor(private httpCLient: HttpClient) {
    this.baseURL = environment.ResourceServer.Endpoint + "customers";
  }
  get(filter: string, sort: string, page: number, pageSize: number): Observable<Client[]> {
    return this.httpCLient.get<Client[]>(this.baseURL, {
      params: new HttpParams()
        .set('filter', filter)
        .set('sort', sort)
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
    })
  }
  getAll(): Observable<Client[]> {
    return this.httpCLient.get<Client[]>(this.baseURL + "/getAll");
  }
  getAllCustomers(): Observable<Client[]> {
    return this.httpCLient.get<Client[]>(this.baseURL + "/all");
  }
  getById(item : Client) : Observable<Client>{
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.get<Client>(this.baseURL + "/" + item.organizationId+"/suppliercustomers/"+item.id  ).pipe(catchError(this.handleError) )
  }
  switchState(item : Client) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL + "/" + item.organizationId+"/suppliercustomers/"+item.id+"/change-status",null )
    .pipe(catchError(this.handleError) )
  }
 
  getPotentialCustomers(): Observable<Customer[]> {
    return this.httpCLient.get<Customer[]>(this.baseURL + "/potentials");
  }
  post(value: Client) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.post(this.baseURL , value).pipe(catchError(this.handleError) );
  }
  getRankedCuotmers() : Observable<any[]> {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.get<any[]>(environment.ResourceServer.QuotaEndPoint).pipe(catchError(this.handleError) );
  }
  handleError(handleError) {
    let errorMessages  = ""
    if (handleError.error instanceof ErrorEvent) {
      // client-side error
      errorMessages = `Error: ${handleError.error.message}`;
    } else {
      // server-side error
     
      let errors = handleError.error.errors.ErrorMessages;
     
      errors.forEach( (element : any)=> {
        errorMessages = errorMessages + "-" + element + "\n"
      });
      //console.log(errorMessages);
      
      
    }
    //window.alert(errorMessages);
    return throwError(errorMessages);
  }
}
