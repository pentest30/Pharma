import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { ThousandSuffixesPipe } from '../shared/thousandSuffixes.pipe';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService extends BaseService {
 
 
  baseURL: string;
  constructor(private httpCLient : HttpClient) {
   super();
   this.baseURL = environment.ResourceServer.Endpoint + "invoices";
  }   
  add(deliveryOrderId): Observable<any> {
      return this.httpCLient.post<any>(this.baseURL +'/'+ deliveryOrderId,{deliveryOrderId :deliveryOrderId} ).pipe(catchError(this.handleError) );
  }
  print(Id): Observable<any> {
    return this.httpCLient.post<any>(this.baseURL +'/print/'+ Id,{} ).pipe(catchError(this.handleError) );
  }
  PrintBulkBl(Ids: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.post(this.baseURL+'/bulkPrint' , Ids).pipe(catchError(this.handleError) );
  }
  getInvoiceById(invoiceId) {
    return this.httpCLient.get(this.baseURL+'/'+invoiceId).pipe(catchError(this.handleError) );

  }
  createCreditNote(creditNote) {
    return this.httpCLient.post(this.baseURL+'/'+creditNote.invoiceId+'/create-creditnote', creditNote).pipe(catchError(this.handleError) );
  }
  getTurnoverOfCustomer(customerId , start , end) {
    var url = this.baseURL+'/'+customerId +'/trunover';
    if(start)
      url +="?start="+ start;
    if(end&& start)    {
      url +="&&end=" + end;
    }
    else if(end) {
      url +="?end=" + end;
     }
    return this.httpCLient.get(url).pipe(catchError(this.handleError) );

  }
  getDetsOfCustomer(customerId) {
    return this.httpCLient.get(this.baseURL+'/'+customerId + '/customer-debt').pipe(catchError(this.handleError) );

  }
  getTurnoversOfCustomers(period : any) {
    let header = new HttpHeaders();
    header.append('start', period);
    if(period)
     return this.httpCLient.get(this.baseURL+'/all-turnovers/?period='+period).pipe(catchError(this.handleError) );
     else  return this.httpCLient.get(this.baseURL+'/all-turnovers').pipe(catchError(this.handleError) );

  }
}
