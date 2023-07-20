import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Supplier } from '../tiers/supplier/models/supplier-model';
import * as uuid from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  delete(id: string) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    
    return this.httpCLient.delete(this.baseURL + "/" + id  ).pipe(catchError(this.handleError) )
  }
  update(value: Supplier) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL + "/" + value.id , value).pipe(catchError(this.handleError) );
  }
  add(value: Supplier) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    value.id = uuid.v4();
    return this.httpCLient.post(this.baseURL , value).pipe(catchError(this.handleError) );
  }
  
  baseURL = "";
  constructor(private httpCLient: HttpClient) {
    this.baseURL = environment.ResourceServer.Endpoint + "suppliers";
  }
  get(filter: string, sort: string, page: number, pageSize: number): Observable<Supplier[]> {
    return this.httpCLient.get<Supplier[]>(this.baseURL, {
      params: new HttpParams()
        .set('term', filter)
        .set('sort', sort)
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
    })
  }
  getAll(): Observable<Supplier[]> {
    return this.httpCLient.get<Supplier[]>(this.baseURL + "/getAll");
  }
  getSupplierByOrgId(organizationId): Observable<any> {
    return this.httpCLient.get<any>(this.baseURL + "/" + organizationId);
  }
  getAll2() {
    this.httpCLient.get<Supplier[]>(this.baseURL + "/b2b-customer").subscribe(response => {
    });
  }
  getCustomerSuppliers(): Observable<Supplier[]> {
    return this.httpCLient.get<Supplier[]>(this.baseURL + "/b2b-customer");
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
