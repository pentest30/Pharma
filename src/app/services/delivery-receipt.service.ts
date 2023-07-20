import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CreateReceiptItemCommand } from '../procurment/models/DeliveryReceiptItem';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryReceiptService extends BaseService{
 
  baseURL : string;

  constructor(private httpClient: HttpClient) { 
    super();
    this.baseURL = environment.ResourceServer.Endpoint +  "delivery-receipts";
  }
  add(receiptId, receiptItem: CreateReceiptItemCommand) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.post(this.baseURL+'/'+receiptId+'/items/' , receiptItem).pipe(catchError(this.handleError) );
  }
  updateItem(receiptId, receiptItem: CreateReceiptItemCommand) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.put(this.baseURL+'/'+receiptId+'/update/' , receiptItem).pipe(catchError(this.handleError) );
  }
  save(receiptId) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.put(this.baseURL+'/'+receiptId+'/save' , {}).pipe(catchError(this.handleError) );
  }
  validate(receiptId) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.put(this.baseURL+'/'+receiptId+'/validate' , {}).pipe(catchError(this.handleError) );
  }
  getDeliveryReceiptById(receiptId) {
    return this.httpClient.get(this.baseURL+'/'+receiptId).pipe(catchError(this.handleError) );
  }
  deleteReceiptItem(receiptId: any, productId: any, internalBatchNumber: any, totalAmount: any, receiptsAmountExcTax: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.delete(this.baseURL+'/'+ receiptId +'/items/'+ productId + '/' + internalBatchNumber + '/' + totalAmount + '/'
    + receiptsAmountExcTax ).pipe(catchError(this.handleError) );
  }
  delete(receiptId) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.delete(this.baseURL+'/'+ receiptId +'/remove').pipe(catchError(this.handleError) );
  }
}
