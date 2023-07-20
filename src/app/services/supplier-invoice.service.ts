import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierInvoiceService extends BaseService{
 
  
  baseURL : string;
  customerUrl : string;

  constructor(private httpClient: HttpClient) { 
    super();
    this.baseURL = environment.ResourceServer.Endpoint +  "supplier-invoices";
  }
  validateInvoice(invoiceId: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.put(this.baseURL+'/'+ invoiceId + '/validate', null).pipe(catchError(this.handleError) );
  }
  createSupplierInvoiceItem(invoiceId: any, supplierInvoiceItem: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.post(this.baseURL+'/'+invoiceId+'/items/' , supplierInvoiceItem).pipe(catchError(this.handleError) );
  }
  updateInvoiceItemCommand(invoiceId: any, supplierInvoiceItem: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.put(this.baseURL+'/'+invoiceId+'/update/' , supplierInvoiceItem).pipe(catchError(this.handleError) );
  }
  deleteSupplierInvoiceItem(invoiceId: any, productId: any, internalBatchNumber) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.delete(this.baseURL+'/'+ invoiceId +'/items/'+ productId + '/' + internalBatchNumber).pipe(catchError(this.handleError) );
  }
  
  getInvoiceById(id) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.get(this.baseURL + "/" + id ).pipe(catchError(this.handleError) )
  }

  getInvoiceByRefSync(command) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.post(this.baseURL + "/get-invoice-ref", command).pipe(catchError(this.handleError) )
  }
 
}
