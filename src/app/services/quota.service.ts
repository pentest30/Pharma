import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ReservedQuota } from '../quotas/Models/reserved.quota.model';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class QuotaService extends BaseService{
  baseURL: string;

  constructor(private httpCLient: HttpClient)  {
    super();
    this.baseURL = environment.ResourceServer.Endpoint + "quotas";
   }
   post(value: ReservedQuota) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.post(this.baseURL  , value).pipe(catchError(this.handleErrors) );
  }
  getTotal() {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.get(this.baseURL+ "/request/total"  ).pipe(catchError(this.handleErrors) );
  }
  postRequest(value: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.post(this.baseURL + "/request"  , value).pipe(catchError(this.handleErrors) );
  }
  put(value: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL +"/" + value.id, value ).pipe(catchError(this.handleError) );
  }
  validate(value: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL +"/validate/" + value,null).pipe(catchError(this.handleError) );
  }
  validateByCustomer(value: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL +"/validate/" + value.requestId + "/customers",value).pipe(catchError(this.handleError) );
  }
  rejectQuotaRequest(value: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL +"/" + value + "/reject",null).pipe(catchError(this.handleError) );
  }
  getQuotabyProduct(value: string, date : string) : Observable<any>{
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.get<any>(this.baseURL +"?productId=" + value + "&date=" + date  ).pipe(catchError(this.handleError) );
  }
  getQuotadetails(value: string, value2 : string) : Observable<any>{
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.get<any>(this.baseURL +"/" + value + "/sales-person/"+ value2+ "/details"   ).pipe(catchError(this.handleError) );
  }
  getQuotabyProductId(value: string) : Observable<any>{
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.get<any>(this.baseURL +"/" + value+"/sales-person" ).pipe(catchError(this.handleError) );
  }
  getQuotabyCustomer(value: string, ) : Observable<any>{
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.get<any>(this.baseURL +"/" + value  ).pipe(catchError(this.handleError) );
  }
  updateQuotaSalesPerson(value:any){
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL +"/update/"+ value.oldSalesPersonId +"/salesperson" , value ).pipe(catchError(this.handleError) );
  }
  transferQuotaSalesPerson(value:any){
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL +"/customers/release" , value ).pipe(catchError(this.handleError) );
  }
  handleErrors (errorRequest: any) :Observable<any>{
    //console.log(errorRequest);
    let modelStateErrors = "";
    for (let index = 0; index < errorRequest?.error?.length; index++) {
      const el = errorRequest.error[index];
      let errors = el?.errors;
      if(!errors) continue;
      errors.forEach(msg => {
        var message = msg.errorMessage;
        modelStateErrors = modelStateErrors + "\n-" + message +"."

      });


    }
    return throwError(modelStateErrors || 'Server error');
  }
}
